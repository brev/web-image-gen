import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { checkConfig, defaultConfig, getConfig } from './config.js'
import clean from './clean.js'
import { createInterface } from 'node:readline/promises'
import generate from './generate.js'
import getCLI from './cli.js'
import {
  imageContentTypes,
  imageInputFormats,
  imageOutputFormats,
  manifestOutputFormats,
} from './common.js'
import optimize from './optimize.js'
import remove from './remove.js'
import { stdin, stdout } from 'node:process'

export {
  checkConfig,
  clean,
  defaultConfig,
  generate,
  getCLI,
  getConfig,
  imageContentTypes,
  imageInputFormats,
  imageOutputFormats,
  manifestOutputFormats,
  optimize,
  remove,
}

// commands

const commands = {
  generate: async (config: Config, options: Options) => {
    if (command === 'generate') {
      if ('verbose' in options) {
        const entities =
          'only' in options ? options.only : 'images and manifests'
        console.log(`Generating ${entities}...`)
        if ('force' in options)
          console.log('Overwriting already existing files!')
      }
      await generate(config, options)
    }
  },

  originals: async (config: Config, options: Options) => {
    if ('optimize' in options) {
      if ('verbose' in options)
        console.log(
          `Original source images: Minimizing size while trying to maintain quality...`
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
    if ('verbose' in options) {
      const entities = 'only' in options ? options.only : 'images and manifests'
      console.log(`Cleaning and removing generated ${entities} files...`)
    }
    await clean(config, options)
  },
}

// main

// await new Promise((resolve) => setTimeout(resolve, 1)) // log after node warns

const { command, options } = getCLI()

const config = await getConfig(options)

if (command === 'generate') await commands.generate(config, options)
if (command === 'originals') await commands.originals(config, options)
if (command === 'clean') await commands.clean(config, options)
