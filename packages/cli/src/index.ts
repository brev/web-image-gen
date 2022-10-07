import { checkConfig, defaultConfig, getConfig } from './config.js'
import clean from './clean.js'
import generate from './generate.js'
import optimize from './optimize.js'
import remove from './remove.js'

export type {
  Config,
  Credit,
  Credits,
  ImageSet,
  ImageSets,
  Options,
} from 'web-image-gen-common'

export {
  checkConfig,
  clean,
  defaultConfig,
  generate,
  getConfig,
  optimize,
  remove,
}
