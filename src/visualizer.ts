import fs from 'fs'
import { join, relative, basename } from 'path'
import chokidar from 'chokidar'
import { start as startServer } from 'webpack-bundle-analyzer'
import { BundleStats } from './bundleStats'
import debounce from 'lodash.debounce'
import { cwd, log } from './utils'

export const start = async (input: string | undefined, options: Record<string, any>) => {
  if (!input) {
    throw new Error('Need input folder!')
  }

  const { watch = false } = options

  const bundleStats = new BundleStats()
  const entry = join(cwd, input)
  const entryBase = basename(entry)

  const read = (readPath) => {
    for (const l1 of fs.readdirSync(readPath)) {
      const l1Path = join(readPath, l1)
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
    name: basename(entry) + '.js',
    size: bundleStats.totalSize
  })

  if (watch) {
    let firstLoaded = false

    const { updateChartData } = await startServer(bundleStats.statsJSON, {
      reportTitle: basename(entry) + ' - Folder Analyzer',
    })
    const update = () => {
      bundleStats.clean()
      read(entry)
      bundleStats.setInfo({
        name: basename(entry) + '.js',
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
      name: basename(entry) + '.js',
      size: bundleStats.totalSize
    })
    startServer(bundleStats.statsJSON, {
      reportTitle: basename(entry) + ' - Folder Analyzer',
    })
  }
}