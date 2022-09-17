export default {
  loaders: [
    'esm-loader-json',
    'esm-loader-typescript',
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
