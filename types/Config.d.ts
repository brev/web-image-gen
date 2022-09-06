export type Config = {
  formats: Array<string>
  sizes: Array<number>
  default: {
    format: string
    size: number
  }
  dirs: {
    generated: string
    static: string
    images: string
    manifests: string
  }
  originals: {
    format: string
  }
  version: string
}
