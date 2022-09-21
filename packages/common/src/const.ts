export const imageContentTypes: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp',
}

export const imageInputFormats: Array<string> = Object.keys(imageContentTypes)

export const imageOutputFormats: Array<string> = imageInputFormats.filter(
  (format) => !['svg', 'tif', 'tiff'].includes(format)
)

export const manifestOutputFormats: Array<string> = ['json', 'js', 'ts']
