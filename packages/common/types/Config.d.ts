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
    version: string
  }
  manifests: {
    format: string
    src: string
    slug: string
  }
}
