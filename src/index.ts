import cac from 'cac'

import { start } from './analyzer'
import { log } from './utils'

export type CliArgs = {
  watch: boolean
  exclude: string
}

export const startCli = () => {
  const cli = cac('folder-analyzer')

  cli
    .option('--watch', 'Watch for changes', {
      default: false
    })
    .option('--exclude', 'Exclude files or folders', {
      default: 'node_modules/**, .git/**'
    })
    .help()

  const parsed = cli.parse()

  log(parsed)

  if (parsed.args.length < 1) {
    cli.outputHelp()
    return
  }

  const input = parsed.args[0]

  start(input, parsed.options as CliArgs)
}

export { start }

export default start