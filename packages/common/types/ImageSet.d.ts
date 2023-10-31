import type { Meta } from './Meta'

export type ImageSet = {
  default: string
  formats: {
    [key: string]: Record<string, string>
  }
  meta: Meta | null
  placeholder: string
  sizes: {
    [key: string]: Record<string, string>
  }
}

export type ImageSets = Record<string, ImageSet>
