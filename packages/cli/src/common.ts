import type { Config, Options } from '../types'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'

// const

export const imageInputFormats: Array<string> = [
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',
]

export const imageOutputFormats: Array<string> = imageInputFormats.filter(
  (format) => !['svg', 'tif', 'tiff'].includes(format)
)

export const manifestOutputFormats: Array<string> = ['json', 'js', 'ts']

// functions

export const deepMerge = deepmergeCustom({ mergeArrays: false })

export const getFlags = (options: Options) => ({
  force: 'force' in options,
  only: 'only' in options && options.only,
  verbose: 'verbose' in options,
})

export const getServePath = (config: Config) => (path: string) =>
  path.replace(config.images.static, '').concat(`?v=${config.images.version}`)

export const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
