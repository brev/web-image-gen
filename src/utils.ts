import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { deepmergeCustom } from 'deepmerge-ts'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const deepMerge = deepmergeCustom({ mergeArrays: false })

export const getFlags = (options: Options) => ({
  force: 'force' in options,
  only: 'only' in options && options.only,
  verbose: 'verbose' in options,
})

export const getServePath = (config: Config) => (path: string) =>
  path.replace(config.dirs.static, '').concat(`?v=${config.version}`)

export const getVersion = async () => {
  let pkg: string
  try {
    pkg = await readFile(resolve(cwd(), 'package.json'), 'utf8')
    if (pkg) return JSON.parse(pkg).version
  } catch {}
  return Date.now()
}

export const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
