import type { Config } from '../types/Config'
import type { Credit } from '../types/Credit'
import type { ImageSets } from '../types/ImageSet'
import type { Options } from '../types/Arguments'
import type { Sharp } from 'sharp'

import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { extname, resolve } from 'path'
import {
  getFlags,
  getServePath,
  imageOutputFormats,
  shortPath,
} from './common.js'
import prettier from 'prettier'
import sharp from 'sharp'

/**
 * Generate
 */
export default async (config: Config, options: Options) => {
  const { force, only, verbose } = getFlags(options)
  const servePath = getServePath(config)
  const imageOutputRegExp = new RegExp(`\\.(${imageOutputFormats.join('|')})`)

  // main
  const imageRoot = resolve(config.images.static, config.images.images)
  const imageDirs = (await readdir(imageRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

  for (const imageDir of imageDirs) {
    const imageDirPath = resolve(imageRoot, imageDir)
    const manifest: ImageSets = {}
    let manifestWrite = only != 'images' ? true : false

    if (verbose)
      console.log(
        `Processing original source images dir: ${shortPath(imageDirPath)}`
      )
    const imageFiles = (await readdir(imageDirPath, { withFileTypes: true }))
      .filter(
        (file) =>
          file.isFile() &&
          imageOutputFormats.includes(extname(file.name).replace('.', ''))
      )
      .map((file) => file.name)

    for (const imageFile of imageFiles) {
      const imageSlug = imageFile.replace(imageOutputRegExp, '')
      const imagePath = resolve(imageDirPath, imageFile)
      const creditPath = imagePath.replace(imageOutputRegExp, '.json')
      const genDirPath = resolve(imageDirPath, config.images.slug)
      const sharpPromises = []
      let creditExists = true
      manifest[imageSlug] = {
        credit: null,
        default: '',
        formats: {},
        placeholder: '',
        sizes: {},
      }

      // load credit if exists
      try {
        await access(creditPath)
      } catch {
        creditExists = false
      }
      if (creditExists) {
        const credit: Credit = JSON.parse(
          (await readFile(creditPath)).toString()
        )
        manifest[imageSlug].credit = credit
      }

      // low quality image placeholder (lqip)
      sharpPromises.push(
        sharp(imagePath).resize({ width: 16 }).webp({
          alphaQuality: 20,
          quality: 20,
          smartSubsample: true,
        })
      )

      // check if image 'generated' dir exists and create if missing
      if (only != 'manifests') {
        try {
          await access(genDirPath)
        } catch {
          if (verbose)
            console.log(
              `Creating generated images dir: ${shortPath(genDirPath)}`
            )
          await mkdir(genDirPath, { recursive: true })
        }
      }

      // generate sizes
      for (const size of config.images.sizes) {
        manifest[imageSlug].sizes[size] = {}

        // generate sized formats
        for (const format of config.images.formats) {
          const genFile = `${imageSlug}-${size}.${format}`
          const genPath = resolve(genDirPath, genFile)
          let sharpPromise = sharp(imagePath)
          let imageExists = true

          if (!manifest[imageSlug].formats[format])
            manifest[imageSlug].formats[format] = {}
          manifest[imageSlug].formats[format][size] = servePath(genPath)
          manifest[imageSlug].sizes[size][format] = servePath(genPath)

          if (only === 'manifests') continue

          // check if image already exists
          if (!force && only != 'manifests') {
            try {
              await access(genPath)
            } catch {
              imageExists = false
            }
            if (imageExists) continue
          }

          // generate images
          if (verbose)
            console.log(`Creating generated image file: ${shortPath(genPath)}`)
          manifestWrite = only != 'images'

          if (format === 'avif') sharpPromise = sharpPromise.avif()
          if (format === 'gif') sharpPromise = sharpPromise.gif()
          if (format === 'jpg' || format === 'jpeg')
            sharpPromise = sharpPromise.jpeg({ mozjpeg: true })
          if (format === 'png') sharpPromise = sharpPromise.png()
          if (format === 'webp') sharpPromise = sharpPromise.webp()

          // queue image generation
          sharpPromises.push(
            sharpPromise.resize({ width: size }).toFile(genPath)
          )
        }

        // default image for set
        manifest[imageSlug].default =
          manifest[imageSlug].formats[config.images.default.format][
            config.images.default.size
          ]
      }

      // run all queued image generations
      const sharpResults = await Promise.all(sharpPromises)

      // low quality image placeholder (lqip) for set
      const lqip = await (sharpResults[0] as Sharp).toBuffer()
      const dataURI = `data:image/webp;base64,${lqip.toString('base64')}`
      manifest[imageSlug].placeholder = dataURI
    }

    // manifest
    if (manifestWrite) {
      const manifestPath = resolve(config.manifests.src, config.manifests.slug)
      const manifestFile = resolve(
        manifestPath,
        `${imageDir}.${config.manifests.format}`
      )

      // check if manifest 'generated' dir exists and create if missing
      try {
        await access(manifestPath)
      } catch {
        if (verbose)
          console.log(
            `Creating generated manifests dir: ${shortPath(manifestPath)}`
          )
        await mkdir(manifestPath, { recursive: true })
      }

      // generate manifest
      if (verbose)
        console.log(
          `Creating generated manifest file: ${shortPath(manifestFile)}`
        )
      let manifestSrc = JSON.stringify(manifest, null, '  ')
      if (config.manifests.format === 'js' || config.manifests.format === 'ts')
        manifestSrc = `export default ${manifestSrc}`

      await writeFile(
        manifestFile,
        prettier.format(manifestSrc, { filepath: manifestFile })
      )
    }
  }
}
