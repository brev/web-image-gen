import ImageSet from './ImageSet.svelte'
import { render } from '@testing-library/svelte'

const set = {
  // @TODO typing
  credit: {
    author: 'flynn_chris',
    authorLink: 'https://pixabay.com/users/flynn_chris-140893/',
    link: 'https://pixabay.com/photos/epcot-walt-disney-world-vacation-252810/',
    title: 'Walt Disney World',
    license: 'Pixabay',
    licenseLink: 'https://pixabay.com/service/license/',
  },
  default: '/images/countries/generated/france-800.jpg?v=1.0.1',
  formats: {
    avif: {
      '400': '/images/countries/generated/france-400.avif?v=1.0.1',
      '800': '/images/countries/generated/france-800.avif?v=1.0.1',
    },
    webp: {
      '400': '/images/countries/generated/france-400.webp?v=1.0.1',
      '800': '/images/countries/generated/france-800.webp?v=1.0.1',
    },
    jpg: {
      '400': '/images/countries/generated/france-400.jpg?v=1.0.1',
      '800': '/images/countries/generated/france-800.jpg?v=1.0.1',
    },
  },
  placeholder:
    'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAsABUB8JbACdAEemasmqMcAAP7e2nidMq0HlEdZoCrrYqiePBE3j6jmxFZv8VCuC4CTUK1wG4oNDwzlkVqAAAA=',
  sizes: {
    '400': {
      avif: '/images/countries/generated/france-400.avif?v=1.0.1',
      webp: '/images/countries/generated/france-400.webp?v=1.0.1',
      jpg: '/images/countries/generated/france-400.jpg?v=1.0.1',
    },
    '800': {
      avif: '/images/countries/generated/france-800.avif?v=1.0.1',
      webp: '/images/countries/generated/france-800.webp?v=1.0.1',
      jpg: '/images/countries/generated/france-800.jpg?v=1.0.1',
    },
  },
}

test('ImageSet', () => {
  const { container, getByAltText } = render(ImageSet, { alt: 'Alt', set })

  assert.ok(container.querySelector('picture'))
  Object.keys(set.formats).forEach((format) => {
    let tag: string
    if (format === 'jpg') {
      tag = 'img'
      assert.ok(container.querySelector(`${tag}[class*="lazyload"]`))
      assert.ok(container.querySelector(`${tag}[src="${set.default}"]`))
      assert.ok(container.querySelector(`${tag}[srcset="${set.placeholder}"]`))
    } else {
      tag = 'source'
      assert.ok(container.querySelector(`${tag}[type*="${format}"]`))
    }
    Object.keys(set.formats[format]).forEach((size) => {
      assert.ok(container.querySelector(`${tag}[data-sizes="auto"]`))
      assert.ok(
        container.querySelector(
          `${tag}[data-srcset*="${set.formats[format][size]}"]`
        )
      )
      assert.ok(container.querySelector(`${tag}[data-srcset*="${size}w"]`))
    })
  })
  assert.ok(getByAltText('Alt'))
})
