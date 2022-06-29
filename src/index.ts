import cac from 'cac'

import { start } from './visualizer'
import { log } from './utils'

export const startCli = () => {
  const cli = cac()

  cli.option('--watch', 'Watch for changes', {
    default: false
  })

  const parsed = cli.parse()

  log(parsed)

  const input = parsed.args[0]

  start(input, parsed.options)
}

export { start }

export default start