import type { Config } from '../types/Config'
import type { Credit } from '../types/Credit'
import type { ImageSets } from '../types/ImageSet'
import type { Options } from '../types/Arguments'

import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { cwd } from 'process'
import { extname, resolve } from 'path'
import prettier from 'prettier'
import sharp from 'sharp'

/**
 * Generate
 */
export default async (config: Config, options: Options) => {
  const imageExts = `.${config.originals.format}`
  const force = 'force' in options
  const only = 'only' in options && options.only
  const servePath = (path: string) =>
    path.replace(config.dirs.static, '').concat(`?v=${config.version}`)
  const shortPath = (path: string) => path.replace(`${cwd()}/`, '')
  const verbose = 'verbose' in options

  // main
  const imageRoot = resolve(config.dirs.static, config.dirs.images)
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
      .filter((file) => file.isFile() && extname(file.name) === imageExts)
      .map((file) => file.name)

    for (const imageFile of imageFiles) {
      const imageSlug = imageFile.replace(imageExts, '')
      const imagePath = resolve(imageDirPath, imageFile)
      const creditPath = imagePath.replace(imageExts, '.json')
      const genDirPath = resolve(imageDirPath, config.dirs.generated)
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

      // low quality image placeholder (lqip) webp
      const lqip = await sharp(imagePath)
        .resize({ width: 16 })
        .webp({
          alphaQuality: 20,
          quality: 20,
          smartSubsample: true,
        })
        .toBuffer()
      const dataURI = `data:image/webp;base64,${lqip.toString('base64')}`
      manifest[imageSlug].placeholder = dataURI

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
      for (const size of config.sizes) {
        manifest[imageSlug].sizes[size] = {}

        // generate sized formats
        for (const format of config.formats) {
          const genFile = `${imageSlug}-${size}.${format}`
          const genPath = resolve(genDirPath, genFile)
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
          switch (format) {
            case 'avif':
              await sharp(imagePath)
                .resize({ width: size })
                .avif()
                .toFile(genPath)
              break
            case 'jpg':
              await sharp(imagePath)
                .resize({ width: size })
                .jpeg({ mozjpeg: true })
                .toFile(genPath)
              break
            case 'webp':
              await sharp(imagePath)
                .resize({ width: size })
                .webp()
                .toFile(genPath)
              break
          }
        }

        // default image for set
        manifest[imageSlug].default =
          manifest[imageSlug].formats[config.default.format][
          config.default.size
          ]
      }
    }

    // manifest
    if (manifestWrite) {
      const manifestPath = resolve(config.dirs.manifests, config.dirs.generated)
      const manifestFile = resolve(manifestPath, `${imageDir}.json`)

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
      const manifestSrc = prettier.format(
        JSON.stringify(manifest, null, '  '),
        { parser: 'json' }
      )
      await writeFile(manifestFile, manifestSrc)
    }
  }
}
