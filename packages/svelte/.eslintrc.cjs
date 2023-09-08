module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  plugins: ['testing-library', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
  root: true,
  settings: {
    svelte: {
      compileOptions: {
        postcss: {
          configFilePath: './postcss.config.js',
        },
      },
    },
  },
}
