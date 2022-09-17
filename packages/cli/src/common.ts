import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'

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

export const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
