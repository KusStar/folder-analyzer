import fs from 'fs'
import { join, relative, basename } from 'path'
import chokidar from 'chokidar'
import { start as startServer } from 'webpack-bundle-analyzer'
import debounce from 'lodash.debounce'
import { createFilter } from '@rollup/pluginutils'
import { BundleStats } from './bundleStats'
import { cwd, log } from './utils'
import { analyzeApk } from './apk'
import type { CliArgs } from './index';

export const start = async (input: string | undefined, options: CliArgs) => {
  if (!input) {
    throw new Error('Need input folder!')
  }

  const { watch = false, exclude } = options

  const folderFilter = createFilter(null, exclude.split(',').map(x => x.trim()))

  const bundleStats = new BundleStats()
  let entry = join(cwd, input)
  let title = basename(entry)

  if (entry.endsWith('.apk') && fs.statSync(entry).isFile()) {
    const { outDir, ratio } = await analyzeApk(entry)
    title = basename(entry)
    entry = outDir
    bundleStats.ratio = ratio
  }

  const entryBase = basename(entry)

  const read = (readPath) => {
    for (const l1 of fs.readdirSync(readPath)) {
      const l1Path = join(readPath, l1)
      if (!folderFilter(l1Path)) {
        log('skip', l1Path)
        continue
      }
      const stat = fs.statSync(l1Path)
      if (stat.isDirectory()) {
        read(l1Path)
      } else {
        bundleStats.pushModule({
          name: `${entryBase}/${relative(entry, l1Path)}`,
          size: stat.size,
        })
      }
    }
  }

  bundleStats.setInfo({
    name: title,
    size: bundleStats.totalSize
  })

  if (watch) {
    let firstLoaded = false

    const { updateChartData } = await startServer(bundleStats.statsJSON, {
      reportTitle: title + ' - Folder Analyzer',
    })
    const update = () => {
      bundleStats.clean()
      read(entry)
      bundleStats.setInfo({
        name: title,
        size: bundleStats.totalSize
      })
      updateChartData(bundleStats.statsJSON)
      log('updateChartData')
    }
    const debouncedUpdate = debounce(update, 300)
    chokidar.watch(entry)
      .on('all', (op, file) => {
        log(op, relative(entry, file))
        if (op === 'addDir') return
        if (firstLoaded) {
          debouncedUpdate()
        } else {
          update()
          firstLoaded = true
        }
      })
  } else {
    read(entry)
    log('> Collected bundleStats.json')
    bundleStats.setInfo({
      name: title,
      size: bundleStats.totalSize
    })
    startServer(bundleStats.statsJSON, {
      reportTitle: title + ' - Folder Analyzer',
    })
  }
}