import type { Config } from '../types/Config'

import { resolve } from 'path'

/* Config */
// load from svelte config? defaults?
// @TODO: Load config from: .sveltekit-imagegen.js(on) or from --config param
// lqip option
// ignore option

const { version } = (
  await import(resolve('package.json'), { assert: { type: 'json' } })
).default

export const defaultConfig: Config = {
  formats: ['avif', 'webp', 'jpg'], // ordered!!  warn if not supported type
  sizes: [400, 800],
  default: {
    format: 'jpg',
    size: 800,
  },
  dirs: {
    static: resolve('static'),
    image: 'images', // relative to static dir above
    generated: 'generated', // subdir to put generated images in
    code: resolve('src/lib/assets/images'),
  },
  exts: {
    image: '.jpg',
  },
  version,
}

export default defaultConfig
