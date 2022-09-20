import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
  },
  package: {
    files: (file) => !file.endsWith('.test.ts'),
  },
  preprocess: preprocess(),
}
