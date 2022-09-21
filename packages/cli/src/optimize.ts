import type { Config, Options } from 'web-image-gen-common'
import type { FormatEnum } from 'sharp'

import { extname, resolve } from 'node:path'
import { getFlags, shortPath } from './common.js'
import { imageInputFormats } from 'web-image-gen-common/const'
import { readdir, rename, rm, stat } from 'node:fs/promises'
import sharp from 'sharp'

/**
 * Optimize
 */
export default async (config: Config, options: Options) => {
  const { verbose } = getFlags(options)

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
      const imageExt = extname(imageFile).replace('.', '')
      const imagePath = resolve(imageDirPath, imageFile)
      const imageOptPath = resolve(imageDirPath, `_OPT_${imageFile}`)

      await sharp(imagePath)
        .toFormat(imageExt as keyof FormatEnum, {
          mozjpeg: /jpe?g/.test(imageExt),
        })
        .toFile(imageOptPath)

      // only write if at least 5% compression improvement, otherwise skip
      const sizeBefore = (await stat(imagePath)).size
      const sizeAfter = (await stat(imageOptPath)).size
      if (1 - sizeAfter / sizeBefore > 0.05) {
        if (verbose)
          console.log(
            `Optimizing original source image file: ${shortPath(imagePath)}`
          )
        // save new image
        await rm(imagePath)
        await rename(imageOptPath, imagePath)
      } else {
        // keep old image
        await rm(imageOptPath)
      }
    }
  }
}
