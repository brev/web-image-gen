export type Config = {
  formats: Array<string>
  sizes: Array<number>
  default: {
    format: string
    size: number
  }
  manifests: string
  dirs: {
    generated: string
    static: string
    images: string
    manifests: string
  }
  version: string
  originals: {
    format: string
  }
}
