export type Config = {
  images: {
    default: {
      format: string
      size: number
    }
    formats: Array<string>
    images: string
    sizes: Array<number>
    slug: string
    static: string
  }
  manifests: {
    format: string
    src: string
    slug: string
  }
  version: string
}
