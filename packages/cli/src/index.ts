import { checkConfig, defaultConfig, getConfig } from './config.js'
import clean from './clean.js'
import { creditStub, imageSetStub } from 'web-image-gen-common/stub'
import generate from './generate.js'
import {
  imageContentTypes,
  imageInputFormats,
  imageOutputFormats,
  manifestOutputFormats,
} from 'web-image-gen-common/const'
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
  creditStub,
  checkConfig,
  clean,
  defaultConfig,
  generate,
  getConfig,
  imageContentTypes,
  imageInputFormats,
  imageOutputFormats,
  imageSetStub,
  manifestOutputFormats,
  optimize,
  remove,
}
