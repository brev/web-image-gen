import ImageSet from './ImageSet.svelte'
import { render } from '@testing-library/svelte'
import set from '../../test/imageSetStub.json'

type Formats = Record<string, Record<string, string>>

test('with props', () => {
  const { container, getByAltText } = render(ImageSet, {
    alt: 'Alt',
    imgClass: 'imgClass',
    pictureClass: 'pictureClass',
    set,
  })

  assert.ok(container.querySelector('picture[class*="web-image-gen-picture"]'))
  assert.ok(container.querySelector('picture[class*="pictureClass"]'))
  Object.keys(set.formats).forEach((format) => {
    let tag: string
    if (format === 'jpg') {
      tag = 'img'
      assert.ok(container.querySelector(`${tag}[class*="web-image-gen-img"]`))
      assert.ok(container.querySelector(`${tag}[class*="imgClass"]`))
      assert.ok(container.querySelector(`${tag}[class*="lazyload"]`))
      assert.ok(container.querySelector(`${tag}[src="${set.default}"]`))
      assert.ok(container.querySelector(`${tag}[srcset="${set.placeholder}"]`))
    } else {
      tag = 'source'
      assert.ok(container.querySelector(`${tag}[type*="${format}"]`))
    }
    const sizes = (set.formats as Formats)[format]
    Object.keys(sizes).forEach((size) => {
      assert.ok(container.querySelector(`${tag}[data-sizes="auto"]`))
      assert.notOk(container.querySelector(`${tag}[sizes]`))
      assert.ok(
        container.querySelector(`${tag}[data-srcset*="${sizes[size]}"]`)
      )
      assert.ok(container.querySelector(`${tag}[data-srcset*="${size}w"]`))
    })
  })
  assert.ok(getByAltText('Alt'))
})

test('with props: sizes', () => {
  const { container } = render(ImageSet, {
    set,
    sizes: 'sizes',
  })

  Object.keys(set.formats).forEach((format) => {
    const tag = format === 'jpg' ? 'img' : 'source'
    const sizes = (set.formats as Formats)[format]
    Object.keys(sizes).forEach((size) => {
      assert.notOk(container.querySelector(`${tag}[data-sizes]`))
      assert.ok(container.querySelector(`${tag}[sizes="sizes"]`))
      assert.ok(
        container.querySelector(`${tag}[data-srcset*="${sizes[size]}"]`)
      )
      assert.ok(container.querySelector(`${tag}[data-srcset*="${size}w"]`))
    })
  })
})
