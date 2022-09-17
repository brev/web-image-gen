import type { Credit } from './Credit'

export type ImageSet = {
  credit: Credit | null
  default: string
  formats: {
    [key: string]: Record<string, string>
  }
  placeholder: string
  sizes: {
    [key: string]: Record<string, string>
  }
}

export type ImageSets = Record<string, ImageSet>
