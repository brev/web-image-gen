import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepMerge, getVersion } from './utils.js'
import { extname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

export const defaultConfig: Config = {
  formats: ['avif', 'webp', 'jpg'], // output. ordered!!  warn if not supported type
  sizes: [400, 800], // output
  default: {
    // output manifest, ref format and size above
    format: 'jpg',
    size: 800,
  },
  manifests: 'json', // ts js json @TODO
  dirs: {
    static: resolve('static'), // sveltekit static folder
    images: 'images', // web serving root, relative to static dir above
    manifests: resolve('src/lib/assets/images'), // sveltekit src/lib subpath
    generated: '_gen', // subdir to put generated files in (both)
  },
  version: await getVersion(), // package.json version, or unix epoch timestamp
  originals: {
    format: 'jpg', // original image source format
  },
}

export const contentTypes = {
  apng: 'image/apng',
  avif: 'image/avif',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  pjpeg: 'image/jpeg',
  pjp: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
}

export const checkConfig = (config: Config) => {
  const imageExts = Object.keys(contentTypes)
  // formats
  config.formats.forEach((format) => {
    if (!imageExts.includes(format))
      throw new Error(`Unsupported image format ${format} in 'formats'!`)
  })
  // default
  if (!imageExts.includes(config.default.format))
    throw new Error(
      `Unsupported image format in 'default': ${config.default.format}!`
    )
  if (!config.formats.includes(config.default.format))
    throw new Error(
      `Image format in 'default' ${config.default.format} not found in 'formats'!`
    )
  if (!config.sizes.includes(config.default.size))
    throw new Error(
      `Image size in 'default' ${config.default.size} not found in 'sizes'!`
    )
  // originals
  if (!imageExts.includes(config.originals.format))
    throw new Error(
      `Unsupported image format in 'originals': ${config.originals.format}!`
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
