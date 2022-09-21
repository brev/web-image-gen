import { Credit as CreditType } from '../types/Credit'
import { ImageSet as ImageSetType } from '../types/ImageSet'

export const creditStub: CreditType = {
  author: 'flynn_chris',
  authorLink: 'https://pixabay.com/users/flynn_chris-140893/',
  link: 'https://pixabay.com/photos/epcot-walt-disney-world-vacation-252810/',
  title: 'Walt Disney World',
  license: 'Pixabay',
  licenseLink: 'https://pixabay.com/service/license/',
}

export const imageSetStub: ImageSetType = {
  credit: creditStub,
  default: '/images/countries/generated/france-800.jpg?v=54321',
  formats: {
    avif: {
      '400': '/images/countries/generated/france-400.avif?v=54321',
      '800': '/images/countries/generated/france-800.avif?v=54321',
    },
    webp: {
      '400': '/images/countries/generated/france-400.webp?v=54321',
      '800': '/images/countries/generated/france-800.webp?v=54321',
    },
    jpg: {
      '400': '/images/countries/generated/france-400.jpg?v=54321',
      '800': '/images/countries/generated/france-800.jpg?v=54321',
    },
  },
  placeholder:
    'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAsABUB8JbACdAEemasmqMcAAP7e2nidMq0HlEdZoCrrYqiePBE3j6jmxFZv8VCuC4CTUK1wG4oNDwzlkVqAAAA=',
  sizes: {
    '400': {
      avif: '/images/countries/generated/france-400.avif?v=54321',
      webp: '/images/countries/generated/france-400.webp?v=54321',
      jpg: '/images/countries/generated/france-400.jpg?v=54321',
    },
    '800': {
      avif: '/images/countries/generated/france-800.avif?v=54321',
      webp: '/images/countries/generated/france-800.webp?v=54321',
      jpg: '/images/countries/generated/france-800.jpg?v=54321',
    },
  },
}
