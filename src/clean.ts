import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'process'
import { readdir, rm } from 'fs/promises'
import { resolve } from 'path'

/**
 * Clean
 */
export default async (config: Config, options: Options) => {
  const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
  const verbose = 'verbose' in options

  const imageRoot = resolve(config.dirs.static, config.dirs.images)
  const imageDirs = (await readdir(imageRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

  for (const imageDir of imageDirs) {
    const imageDirPath = resolve(imageRoot, imageDir)
    const genPath = resolve(imageDirPath, config.dirs.generated)

    if (verbose)
      console.log(`Removing generated images dir: ${shortPath(genPath)}`)
    await rm(genPath, { recursive: true })
  }

  const manifestPath = resolve(config.dirs.manifests, config.dirs.generated)
  if (verbose)
    console.log(`Removing generated manifests dir: ${shortPath(manifestPath)}`)
  await rm(manifestPath, { recursive: true })
}
