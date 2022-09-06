import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { checkConfig, defaultConfig, getConfig } from './config.js'
import clean from './clean.js'
import { createInterface } from 'node:readline/promises'
import generate from './generate.js'
import getCLI from './cli.js'
import optimize from './optimize.js'
import remove from './remove.js'
import { stdin, stdout } from 'node:process'

export { checkConfig, defaultConfig, generate, getConfig }

// @TODO more inputs than .jpg (.png, .gif, etc)
// @TODO 'help' command and tests
// @TODO 'clean' --only=images|manifests and tests
// @TODO refactors
// @TODO config: load dirs from sveltekit config
// @TODO config: checkConfig
// @TODO README.md
// @TODO generate: parallelize?

// commands

const commands = {
  generate: async (config: Config, options: Options) => {
    if (command === 'generate') {
      if ('verbose' in options) {
        const entities =
          'only' in options ? options.only : 'images and manifests'
        console.log(`Generating ${entities}...`)
      }
      if ('force' in options) {
        console.log('Overwriting already existing files!')
      }
      await generate(config, options)
    }
  },

  originals: async (config: Config, options: Options) => {
    if ('optimize' in options) {
      if ('verbose' in options)
        console.log(
          `Original source images: Minimizing while keeping quality...`
        )
      await optimize(config, options)
    } else if ('remove' in options) {
      if (!('force' in options)) {
        const readline = createInterface({ input: stdin, output: stdout })
        const answer = await readline.question(
          'Remove original source images? Are you sure? [y/N]: '
        )
        readline.close()
        if (!answer.toLowerCase().match(/^y(es)?$/)) process.exit()
      }
      if ('verbose' in options)
        console.log(`Original source images: Removing...`)
      await remove(config, options)
    }
  },

  clean: async (config: Config, options: Options) => {
    if ('verbose' in options)
      console.log(`Cleaning up and removing all generated files...`)
    await clean(config, options)
  },
}

// main

await new Promise((resolve) => setTimeout(resolve, 1)) // after any warnings

const { command, options } = getCLI()

const config = await getConfig(options)

switch (command) {
  case 'generate':
    await commands.generate(config, options)
    break
  case 'originals':
    await commands.originals(config, options)
    break
  case 'clean':
    await commands.clean(config, options)
    break
}
