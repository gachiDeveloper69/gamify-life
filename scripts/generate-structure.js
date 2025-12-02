import fs from 'fs';
import path from 'path';

const config = {
  // Полное игнорирование папки (не показывать вообще)
  ignoreFoldersFully: ['node_modules', '.git', 'dist'],

  // Папки, которые показываем, но НЕ сканируем
  ignoreChildrenOnly: [
    'src/assets/styles', // сюда добавить нужное
  ],
};

function normalize(p) {
  return p.replace(/\\/g, '/');
}

function readDirRecursive(dirPath, rootPath) {
  const rel = normalize(path.relative(rootPath, dirPath));

  const item = {
    name: path.basename(dirPath),
    path: dirPath,
    relativePath: rel === '' ? '.' : rel,
    type: 'directory',
    children: [],
  };

  // Если папка должна быть пустой (не сканируем внутрь)
  if (config.ignoreChildrenOnly.some(i => normalize(i) === rel)) {
    return item; // возвращаем только её саму
  }

  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const relPath = normalize(path.relative(rootPath, fullPath));
    const stats = fs.statSync(fullPath);

    // Полностью игнорируем папки типа node_modules
    if (config.ignoreFoldersFully.some(i => normalize(i) === relPath)) {
      continue;
    }

    if (stats.isDirectory()) {
      item.children.push(readDirRecursive(fullPath, rootPath));
    } else {
      item.children.push({
        name: entry,
        path: fullPath,
        relativePath: relPath,
        type: 'file',
        size: stats.size,
      });
    }
  }

  return item;
}

const folderToScan = process.argv[2] || '.';
const rootPath = path.resolve(folderToScan);

const structure = readDirRecursive(rootPath, rootPath);

fs.writeFileSync('structure.json', JSON.stringify(structure, null, 2), 'utf8');

console.log('Готово, бро! Файл structure.json создан.');
