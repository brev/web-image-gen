import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { getFlags, shortPath } from './common.js'
import { readdir, rm } from 'fs/promises'
import { resolve } from 'path'

/**
 * Clean
 */
export default async (config: Config, options: Options) => {
  const { only, verbose } = getFlags(options)

  const imageRoot = resolve(config.images.static, config.images.images)
  const imageDirs = (await readdir(imageRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

  for (const imageDir of imageDirs) {
    const imageDirPath = resolve(imageRoot, imageDir)
    const genPath = resolve(imageDirPath, config.images.slug)

    if (only === 'manifests') continue

    if (verbose)
      console.log(`Removing generated images dir: ${shortPath(genPath)}`)
    await rm(genPath, { recursive: true })
  }

  if (only === 'images') return

  const manifestPath = resolve(config.manifests.src, config.manifests.slug)
  if (verbose)
    console.log(`Removing generated manifests dir: ${shortPath(manifestPath)}`)
  await rm(manifestPath, { recursive: true })
}
