import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    coverage: {
      all: true,
      exclude: ['**/*.d.ts', '**/*.test.ts', '.svelte-kit/**'],
      extension: ['.js', '.cjs', '.ts', '.svelte'],
      reporter: ['text', 'json', 'html'],
      src: ['./src'],
    },
    environment: 'jsdom',
    globals: true,
  },
})
