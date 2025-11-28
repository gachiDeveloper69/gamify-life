import fs from 'fs';
import path from 'path';

function readDirRecursive(dirPath) {
  const result = {
    name: path.basename(dirPath),
    path: dirPath,
    type: 'directory',
    children: [],
  };

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);

    // Пропуск лишних папок
    if (item === 'node_modules' || item === '.git') continue;

    if (stats.isDirectory()) {
      result.children.push(readDirRecursive(fullPath));
    } else {
      result.children.push({
        name: item,
        path: fullPath,
        type: 'file',
        size: stats.size,
      });
    }
  }

  return result;
}

const folderToScan = process.argv[2] || '.';
const structure = readDirRecursive(path.resolve(folderToScan));

fs.writeFileSync('structure.json', JSON.stringify(structure, null, 2), 'utf8');

console.log('Готово! JSON создан: structure.json');
