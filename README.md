# Monorepo (web-image-gen)

This is a Monorepo for `web-image-gen` projects.

## Packages

Projects are in the [`packages/`][packages] directory:

- [web-image-gen][web-image-gen]
- [web-image-gen-svelte][web-image-gen-svelte]
- web-image-gen-react @TODO

## Dependencies

- git
- node
- npm
- pnpm

## Develop

```sh
git clone https://github.com/brev/web-image-gen.git
cd web-image-gen/
npm install -g pnpm
pnpm -r install
pnpm -r clean
pnpm -r format
pnpm -r lint
pnpm -r test:cover
pnpm -r build
```

## License

[MIT][mit-license]

[mit-license]: https://mit-license.org/
[packages]: https://github.com/brev/web-image-gen/tree/main/packages
[web-image-gen]: https://github.com/brev/web-image-gen/tree/main/packages/cli#readme
[web-image-gen-svelte]: https://github.com/brev/web-image-gen/tree/main/packages/svelte#readme
