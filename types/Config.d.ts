export type Config = {
  formats: Array<string>
  sizes: Array<number>
  default: {
    format: string
    size: number
  }
  dirs: {
    static: string
    image: string
    generated: string
    code: string
  }
  exts: {
    image: string
  }
  version: string
}
