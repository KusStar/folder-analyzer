import fs from 'fs'
import extract from 'extract-zip'
import fastFolderSize from 'fast-folder-size'
import { promisify } from 'util'
import tmp from 'tmp-promise'

import { log } from './utils'

const fastFolderSizeAsync = promisify(fastFolderSize)

export const analyzeApk = async (apkFile: string) => {
  const size = fs.statSync(apkFile).size
  log(apkFile, size)
  const { path: outDir } = await tmp.dir()

  await extract(apkFile, {
    dir: outDir,
  })

  const unzipSize = await fastFolderSizeAsync(outDir)
  log(`unzip size: ${unzipSize}`)
  log(`compressed ratio: ${size / unzipSize}`)
  return {
    outDir,
    ratio: size / unzipSize
  }
}