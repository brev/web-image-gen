import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { extname, resolve } from 'path'
import { getFlags, imageInputFormats, shortPath } from './common.js'
import { readdir, rm } from 'fs/promises'

/**
 * Remove
 */
export default async (config: Config, options: Options) => {
  const { verbose } = getFlags(options)

  // main
  const imageRoot = resolve(config.images.static, config.images.images)
  const imageDirs = (await readdir(imageRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

  for (const imageDir of imageDirs) {
    const imageDirPath = resolve(imageRoot, imageDir)

    if (verbose)
      console.log(
        `Processing original source images dir: ${shortPath(imageDirPath)}`
      )
    const imageFiles = (await readdir(imageDirPath, { withFileTypes: true }))
      .filter(
        (file) =>
          file.isFile() &&
          imageInputFormats.includes(extname(file.name).replace('.', ''))
      )
      .map((file) => file.name)

    for (const imageFile of imageFiles) {
      const imagePath = resolve(imageDirPath, imageFile)
      if (verbose)
        console.log(
          `Removing original source image file: ${shortPath(imagePath)}`
        )
      await rm(imagePath)
    }
  }
}
