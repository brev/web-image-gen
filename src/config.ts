import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'
import { extname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

const deepmerge = deepmergeCustom({ mergeArrays: false })
const getVersion = async () => {
  let pkg: string
  try {
    pkg = await readFile(resolve(cwd(), 'package.json'), 'utf8')
    if (pkg) return JSON.parse(pkg).version
  } catch {}
  return Date.now()
}

export const defaultConfig: Config = {
  formats: ['avif', 'webp', 'jpg'], // output. ordered!!  warn if not supported type
  sizes: [400, 800], // output
  default: {
    // output manifest, ref format and size above
    format: 'jpg',
    size: 800,
  },
  dirs: {
    static: resolve('static'), // sveltekit static folder
    images: 'images', // web serving root, relative to static dir above
    manifests: resolve('src/lib/assets/images'), // sveltekit src/lib subpath
    generated: '_gen', // subdir to put generated files in (both)
  },
  originals: {
    format: 'jpg', // original image source format
  },
  version: await getVersion(), // package.json version, or unix epoch timestamp
}

export const checkConfig = (config: Config) => {
  // valid formats
  // last format member should be web standard jpg/gif/png
  // valid sizes
  // default exists in formats+size
  // originals format should be web standard jpg/gif/png
  if (!config.version) throw new Error('Config is missing `version`')
  return config
}

export const getConfig = async (options: Options) => {
  const { config: configFile, verbose } = options
  let config: Config = defaultConfig

  if (configFile) {
    const ext = extname(configFile)
    if (ext === '.json') {
      try {
        const configRaw = await readFile(resolve(cwd(), configFile), 'utf8')
        const configJson = JSON.parse(configRaw)
        config = deepmerge(config, configJson)
        if (verbose) console.log(`Config file read ${configFile}...`)
      } catch (error) {
        throw new Error(
          [
            `Cannot read or parse ${configFile}:`,
            (error as Error).message,
          ].join(' ')
        )
      }
    } else if (ext === '.js') {
      try {
        const { default: configJs } = await import(resolve(cwd(), configFile))
        config = deepmerge(config, configJs)
        if (verbose) console.log(`Config file import ${configFile}...`)
      } catch (error) {
        throw new Error(
          [`Cannot import ${configFile}:`, (error as Error).message].join(' ')
        )
      }
    }
  } else {
    const configFilename = `.sveltekit-imagegen`
    try {
      const configFile = `${configFilename}.json`
      const configRaw = await readFile(resolve(cwd(), configFile), 'utf8')
      const configJson = JSON.parse(configRaw)
      config = deepmerge(config, configJson)
      if (verbose) console.log(`Config file read ${configFile}...`)
    } catch {}
    try {
      const configFile = `${configFilename}.js`
      const { default: configJs } = await import(resolve(cwd(), configFile))
      config = deepmerge(config, configJs)
      if (verbose) console.log(`Config file import ${configFile}...`)
    } catch {}
  }

  if (config === defaultConfig && verbose)
    console.log('Using default config...')

  return checkConfig(config)
}
