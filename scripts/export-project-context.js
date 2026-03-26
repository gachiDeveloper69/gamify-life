#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_IGNORED_NAMES = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache',
  '.idea',
  '.DS_Store',
]);

const DEFAULT_TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.html',
  '.htm',
  '.json',
  '.md',
  '.mdx',
  '.txt',
  '.yml',
  '.yaml',
  '.xml',
  '.svg',
  '.env',
  '.gitignore',
  '.prettierrc',
  '.eslintrc',
  '.npmrc',
  '.editorconfig',
  '.sh',
  '.bash',
  '.zsh',
  '.cjs',
  '.mjs',
  '.vue',
]);

const DEFAULT_BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.bmp',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.ogg',
  '.pdf',
  '.zip',
  '.rar',
  '.7z',
  '.tar',
  '.gz',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.exe',
  '.dll',
  '.bin',
  '.map',
  '.lock',
]);

function parseArgs(argv) {
  const args = {
    targetPath: null,
    output: null,
    maxFileSizeKB: 300,
    includeContent: true,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('--') && !args.targetPath) {
      args.targetPath = arg;
      continue;
    }

    if (arg === '--output' || arg === '-o') {
      args.output = argv[++i];
      continue;
    }

    if (arg === '--max-file-size-kb') {
      args.maxFileSizeKB = Number(argv[++i]);
      continue;
    }

    if (arg === '--no-content') {
      args.includeContent = false;
      continue;
    }
  }

  return args;
}

function normalizeRelativePath(rootPath, fullPath) {
  const relative = path.relative(rootPath, fullPath);
  return relative === '' ? '.' : relative.split(path.sep).join('/');
}

function shouldIgnore(name) {
  return DEFAULT_IGNORED_NAMES.has(name);
}

function isProbablyTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath).toLowerCase();

  if (DEFAULT_BINARY_EXTENSIONS.has(ext)) return false;
  if (DEFAULT_TEXT_EXTENSIONS.has(ext)) return true;
  if (DEFAULT_TEXT_EXTENSIONS.has(base)) return true;

  return false;
}

async function readTextFileSafe(filePath, size, maxBytes) {
  if (size > maxBytes) {
    return {
      skipped: true,
      reason: `File is too large (${size} bytes > ${maxBytes} bytes)`,
    };
  }

  if (!isProbablyTextFile(filePath)) {
    return {
      skipped: true,
      reason: 'File type is treated as binary or unsupported for inline content',
    };
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { skipped: false, content };
  } catch (error) {
    return {
      skipped: true,
      reason: `Failed to read file as UTF-8: ${error.message}`,
    };
  }
}

async function buildTree(fullPath, rootPath, options) {
  const stats = await fs.stat(fullPath);
  const name = path.basename(fullPath);
  const relativePath = normalizeRelativePath(rootPath, fullPath);

  if (stats.isDirectory()) {
    const childrenNames = await fs.readdir(fullPath);
    const filteredChildren = childrenNames
      .filter(childName => !shouldIgnore(childName))
      .sort((a, b) => a.localeCompare(b));

    const children = [];
    for (const childName of filteredChildren) {
      const childFullPath = path.join(fullPath, childName);
      try {
        const childNode = await buildTree(childFullPath, rootPath, options);
        if (childNode) children.push(childNode);
      } catch (error) {
        children.push({
          name: childName,
          path: childFullPath,
          relativePath: normalizeRelativePath(rootPath, childFullPath),
          type: 'error',
          error: error.message,
        });
      }
    }

    return {
      name,
      path: fullPath,
      relativePath,
      type: 'directory',
      children,
    };
  }

  if (stats.isFile()) {
    const fileNode = {
      name,
      path: fullPath,
      relativePath,
      type: 'file',
      size: stats.size,
    };

    if (options.includeContent) {
      const result = await readTextFileSafe(fullPath, stats.size, options.maxFileSizeBytes);

      if (!result.skipped) {
        fileNode.content = result.content;
      } else {
        fileNode.contentSkipped = true;
        fileNode.contentSkipReason = result.reason;
      }
    }

    return fileNode;
  }

  return {
    name,
    path: fullPath,
    relativePath,
    type: 'other',
  };
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.targetPath) {
    console.error(
      [
        'Usage:',
        '  node export-project-context.js <targetPath> [--output result.json] [--max-file-size-kb 300] [--no-content]',
        '',
        'Examples:',
        '  node export-project-context.js ./src/assets/styles',
        '  node export-project-context.js ./src --output context.json',
      ].join('\n')
    );
    process.exit(1);
  }

  const resolvedTargetPath = path.resolve(args.targetPath);
  const stats = await fs.stat(resolvedTargetPath).catch(() => null);

  if (!stats) {
    console.error(`Path does not exist: ${resolvedTargetPath}`);
    process.exit(1);
  }

  const options = {
    includeContent: args.includeContent,
    maxFileSizeBytes: args.maxFileSizeKB * 1024,
  };

  const tree = await buildTree(resolvedTargetPath, resolvedTargetPath, options);
  const json = JSON.stringify(tree, null, 2);

  if (args.output) {
    const resolvedOutput = path.resolve(args.output);
    await fs.writeFile(resolvedOutput, json, 'utf8');
    console.log(`Context exported to: ${resolvedOutput}`);
  } else {
    console.log(json);
  }
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
