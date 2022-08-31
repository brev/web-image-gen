Add a new original JPG image (1600px), and an image credit JSON:

```bash
./countries/atlantis/original.jpg
./countries/atlantis/credit.json
```

then run:

```bash
# compress original images
./optimize.sh

# generate responsive sizes, placeholders, and shared metadata
./generate.ts
```

Note: Metadata is symlinked into `src/lib/assets/images/`.

Operations: Original size images should be removed during build before production release.

# Development

```sh
git checkout <REPO>
cd REPO

npm install -g pnpm
pnpm install
pnpm run clean
pnpm run format
pnpm run lint
pnpm run test
pnpm run build
```
