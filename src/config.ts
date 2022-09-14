import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepMerge, getVersion } from './common.js'
import { extname, resolve } from 'node:path'
import { imageOutputFormats, manifestOutputFormats } from './common.js'
import { readFile } from 'node:fs/promises'

// default config

export const defaultConfig: Config = {
  images: {
    formats: ['avif', 'webp', 'jpg'], // output. ordered!!  warn if not supported type
    sizes: [400, 800], // output
    default: {
      // default generated image to fallback on or use outside imageset
      // output manifest, ref format and size above
      format: 'jpg',
      size: 800,
    },
    static: resolve('static'), // sveltekit static folder
    images: 'images', // image web request root, relative to static dir above
    slug: '_gen', // subdir to put generated images in (under src)
  },
  manifests: {
    format: 'json', // ts js json @TODO
    src: resolve('src/lib/assets/images'), // sveltekit src/lib path
    slug: '_gen', // subdir to put generated manifests in (under src)
  },
  version: await getVersion(), // package.json version, or unix epoch timestamp
}

// functions

export const checkConfig = (config: Config) => {
  // images.formats
  config.images.formats.forEach((format) => {
    if (!imageOutputFormats.includes(format))
      throw new Error(`Unsupported image format ${format} in 'images.formats'!`)
  })
  // images.default
  if (!imageOutputFormats.includes(config.images.default.format))
    throw new Error(
      `Unsupported image format in 'images.default': ${config.images.default.format}!`
    )
  if (!config.images.formats.includes(config.images.default.format))
    throw new Error(
      `Image format in 'images.default' ${config.images.default.format} not found in 'formats'!`
    )
  if (!config.images.sizes.includes(config.images.default.size))
    throw new Error(
      `Image size in 'images.default' ${config.images.default.size} not found in 'sizes'!`
    )
  // manifests.format
  if (!manifestOutputFormats.includes(config.manifests.format))
    throw new Error(
      `Unsupported manifest format in 'manifests.format': ${config.manifests.format}!`
    )
  // version
  if (!config.version) throw new Error(`Config is missing 'version'!`)
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
        config = deepMerge(config, configJson)
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
        config = deepMerge(config, configJs)
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
      config = deepMerge(config, configJson)
      if (verbose) console.log(`Config file read ${configFile}...`)
    } catch {}
    try {
      const configFile = `${configFilename}.js`
      const { default: configJs } = await import(resolve(cwd(), configFile))
      config = deepMerge(config, configJs)
      if (verbose) console.log(`Config file import ${configFile}...`)
    } catch {}
  }

  if (config === defaultConfig && verbose)
    console.log('Using default config...')

  return checkConfig(config)
}
