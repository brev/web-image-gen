import type { Config } from '../types/Config'
import type { Credit } from '../types/Credit'
import type { ImageSets } from '../types/ImageSet'
import type { IndividualArguments } from '../types/Arguments'

import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { cwd } from 'process'
import prettier from 'prettier'
import { resolve } from 'path'
import sharp from 'sharp'

/**
 * Generate
 */
export default async (config: Config, options: IndividualArguments) => {
  // utils
  const servePath = (path: string) =>
    path.replace(config.dirs.static, '').concat(`?v=${config.version}`)
  const shortPath = (path: string) => path.replace(`${cwd()}/`, '')

  // main
  const imageRoot = resolve(config.dirs.static, config.dirs.image)
  const imageDirs = (await readdir(imageRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name)

  for (const imageDir of imageDirs) {
    const imageDirPath = resolve(imageRoot, imageDir)
    const code: ImageSets = {}
    let codeWrite = false

    console.log(`Processing dir: ${shortPath(imageDirPath)}`)
    const imageFiles = (await readdir(imageDirPath, { withFileTypes: true }))
      .filter((file) => file.isFile() && file.name.endsWith(config.exts.image))
      .map((file) => file.name)

    for (const imageFile of imageFiles) {
      const imageSlug = imageFile.replace(config.exts.image, '')
      const imagePath = resolve(imageDirPath, imageFile)
      const creditPath = imagePath.replace(config.exts.image, '.json')
      const genDirPath = resolve(imageDirPath, config.dirs.generated)
      let creditExists = true
      code[imageSlug] = {
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
        code[imageSlug].credit = credit
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
      code[imageSlug].placeholder = dataURI

      // check if 'generated' dir exists and create if missing
      try {
        await access(genDirPath)
      } catch {
        console.log(`Creating generated dir: ${shortPath(genDirPath)}`)
        await mkdir(genDirPath)
      }

      // generate sizes
      for (const size of config.sizes) {
        code[imageSlug].sizes[size] = {}

        // generate sized formats
        for (const format of config.formats) {
          const genFile = `${imageSlug}-${size}.${format}`
          const genPath = resolve(genDirPath, genFile)
          let imageExists = true

          if (!code[imageSlug].formats[format])
            code[imageSlug].formats[format] = {}
          code[imageSlug].formats[format][size] = servePath(genPath)
          code[imageSlug].sizes[size][format] = servePath(genPath)

          // check if image already exists
          try {
            await access(genPath)
          } catch {
            imageExists = false
          }
          if (imageExists) continue

          // generate image
          console.log(`Creating image file: ${shortPath(genPath)}`)
          codeWrite = true
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
        code[imageSlug].default =
          code[imageSlug].formats[config.default.format][config.default.size]
      }
    }

    // code
    if (codeWrite) {
      const codePath = resolve(config.dirs.code, imageDir)
      const codeFile = `${codePath}.json`

      // generate code
      console.log(`Creating code file: ${shortPath(codeFile)}`)
      const codeSrc = prettier.format(JSON.stringify(code, null, '  '), {
        parser: 'json',
      })
      await writeFile(codeFile, codeSrc)
    } else console.log(`  ...nothing to do in ${shortPath(imageDirPath)}`)
  }
}
