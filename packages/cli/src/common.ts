import type { Config, Options } from 'web-image-gen-common'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'

export const deepMerge = deepmergeCustom({ mergeArrays: false })

export const getFlags = (options: Options) => ({
  force: 'force' in options,
  only: 'only' in options && options.only,
  verbose: 'verbose' in options,
})

export const getServePath = (config: Config) => (path: string) =>
  path.replace(config.images.static, '').concat(`?v=${config.images.version}`)

export const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
