import cac from 'cac'

import { start } from './visualizer'
import { log } from './utils'

export const startCli = () => {
  const cli = cac('folder-analyzer')

  cli
    .option('--watch', 'Watch for changes', {
      default: false
    })
    .help()

  const parsed = cli.parse()

  log(parsed)

  if (parsed.args.length < 1) {
    cli.outputHelp()
    return
  }

  const input = parsed.args[0]

  start(input, parsed.options)
}

export { start }

export default start