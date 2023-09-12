import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    server: {
      fs: {
        allow: ['./package.json'],
      },
    },
    test: {
      coverage: {
        all: true,
        exclude: ['**/*.d.ts', '**/*.test.ts', '.svelte-kit/**'],
        extension: ['.js', '.cjs', '.ts', '.svelte'],
        include: ['./src'],
        reporter: ['text', 'json', 'html'],
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, './.svelte-kit'],
      globals: true,
    },
  })
)
