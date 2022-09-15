import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepMerge } from './common.js'
import { extname, resolve } from 'node:path'
import { imageOutputFormats, manifestOutputFormats } from './common.js'
import { readFile } from 'node:fs/promises'

// default config

export const defaultConfig: Config = {
  // Images config.
  images: {
    // Output formats - Ordered!
    //  First entry should be newest modern format, last entry should
    //  be most widely supported older fallback format.
    formats: ['avif', 'webp', 'jpg'],

    // Output width sizes in pixels.
    sizes: [400, 800],

    // Default generated image to fallback on or use outside imageset.
    //  Must refer to valid formats and sizes listed above.
    default: {
      format: 'jpg',
      size: 800,
    },

    // Static assets folder.
    static: resolve('static'),

    // Images subdir underneath the `static` folder above.
    //  Root of web-serving path in browser.
    //  Home of original source image subdirs.
    //  Where generated images will be created.
    images: 'images',

    // Subdir to put generated images in (under `static`/`images`/<group>/ above)
    slug: '_gen',
  },

  // Manifests config
  manifests: {
    // Manifest output format. One of 'json', 'js', or 'ts'.
    format: 'json',

    // Web app source code path for image assets.
    //  Where manifests will be generated.
    src: resolve('src/lib/assets/images'),

    // Subdir to put generated manifests in (under `src` above).
    slug: '_gen',
  },

  // Version for cache-busting
  version: Date.now().toString(),
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
    } else {
      throw new Error('Config file format must be `js` or `json`')
    }
  } else {
    const configFilename = `.web-image-gen`
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
