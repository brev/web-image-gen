export type ImageSet = {
  default: string
  formats: {
    [key: string]: Record<string, string>
  }
  meta: Record<string, any> | null // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder: string
  sizes: {
    [key: string]: Record<string, string>
  }
}

export type ImageSets = Record<string, ImageSet>
