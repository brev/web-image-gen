import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// settings

export const imageContentTypes = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp',
}
export const imageInputFormats = Object.keys(imageContentTypes)
export const imageOutputFormats = imageInputFormats.filter(
  (format) => !['svg', 'tif', 'tiff'].includes(format)
)
export const manifestOutputFormats = ['json', 'js', 'ts']

// functions

export const deepMerge = deepmergeCustom({ mergeArrays: false })

export const getFlags = (options: Options) => ({
  force: 'force' in options,
  only: 'only' in options && options.only,
  verbose: 'verbose' in options,
})

export const getServePath = (config: Config) => (path: string) =>
  path.replace(config.images.static, '').concat(`?v=${config.version}`)

export const getVersion = async () => {
  let pkg: string
  try {
    pkg = await readFile(resolve(cwd(), 'package.json'), 'utf8')
    if (pkg) return JSON.parse(pkg).version
  } catch {}
  return Date.now()
}

export const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
