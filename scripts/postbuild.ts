import fs from 'fs'
import { join } from 'path';

const removeJsMap = (filePath: string) => {
  for (const l1 of fs.readdirSync(filePath)) {
    const l1Path = join(filePath, l1)
    const stat = fs.statSync(l1Path)
    if (stat.isDirectory()) {
      removeJsMap(l1Path)
    } else {
      if (l1Path.endsWith('.js.map')) {
        fs.rmSync(l1Path)
      }
    }
  }
}

removeJsMap(join(__dirname, '../dist'))

console.log('> Postbuild: removed .js.map files')