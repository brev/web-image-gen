import ImageSet1 from './ImageSet.svelte'
import ImageSet2 from './index.js'

test('index', () => {
  assert.equal(ImageSet1, ImageSet2)
})
