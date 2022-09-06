import type { Config } from '../types/Config'
import type { Options } from '../types/Arguments'

import { cwd } from 'node:process'
import { extname, resolve } from 'node:path'
import { readdir, rename, rm, stat } from 'node:fs/promises'
import sharp from 'sharp'

/**
 * Optimize
 */
export default async (config: Config, options: Options) => {
  const imageExts = `.${config.originals.format}`
  const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
  const verbose = 'verbose' in options

  const imageRoot = resolve(config.dirs.static, config.dirs.images)
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
      .filter((file) => file.isFile() && extname(file.name) === imageExts)
      .map((file) => file.name)

    for (const imageFile of imageFiles) {
      const imagePath = resolve(imageDirPath, imageFile)
      const imageOptPath = resolve(imageDirPath, `_OPT_${imageFile}`)

      const sizeBefore = (await stat(imagePath)).size
      await sharp(imagePath)
        .jpeg({ mozjpeg: true })
        .toFile(imageOptPath)
      const sizeAfter = (await stat(imageOptPath)).size

      // only write if at least 5% compression improvement, otherwise skip
      if ((1 - (sizeAfter / sizeBefore)) > 0.05) {
        if (verbose)
          console.log(`Optimizing original source image file: ${shortPath(imagePath)}`)
        await rm(imagePath)
        await rename(imageOptPath, imagePath)
      } else {
        await rm(imageOptPath)
      }
    }
  }
}
