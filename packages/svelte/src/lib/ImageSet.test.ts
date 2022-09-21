import ImageSet from './ImageSet.svelte'
import { imageSetStub as set } from 'web-image-gen-common/stub'
import { render } from '@testing-library/svelte'

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
