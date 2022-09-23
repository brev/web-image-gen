export default {
  loaders: [
    'esm-loader-json',
    {
      loader: 'esm-loader-typescript',
      options: {
        config: 'test/tsconfig.json',
      },
    },
    {
      loader: 'esm-loader-import-relative-extension',
      options: {
        extensions: {
          '.ts': {
            '': '.ts',
            '.js': '.ts',
          },
        },
      },
    },
  ],
}
