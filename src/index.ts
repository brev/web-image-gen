import { createInterface } from 'node:readline/promises'
import generate from './generate.js'
import getCLI from './cli.js'
import getConfig from './config.js'
import { stdin, stdout } from 'process'

export { generate }

await new Promise((resolve) => setTimeout(resolve, 1)) // after any warnings

const { command, options } = getCLI()

// const config = getConfig(options.config)
const config = getConfig

if (command === 'generate') {
  if ('verbose' in options) {
    const entities = 'only' in options ? options.only : 'images and manifests'
    console.log(`Generating ${entities}...`)
  }
  await generate(config, options)
}

if (command === 'originals') {
  if ('optimize' in options) {
    if ('verbose' in options)
      console.log(`Minimizing original source images while keeping quality...`)
  } else if ('remove' in options) {
    if ('verbose' in options) console.log(`Removing original source images...`)
    if (!('force' in options)) {
      const readline = createInterface({ input: stdin, output: stdout })
      const answer = await readline.question('Are you sure? [y/N]:')
      readline.close()
      if (!answer.toLowerCase().match(/^y(es)?$/)) process.exit()
    }
  }
}
