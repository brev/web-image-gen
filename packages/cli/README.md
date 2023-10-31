# web-image-gen

Modern responsive web image generation and tooling.

## About

### Functions

- Generates modern optimized responsive web image sets in specified formats and
  sizes, based on your high-resolution original source images
  (both from under your `static` folder).
  - Input formats:
    `avif`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `tif`, `tiff`, `webp`
  - Output formats:
    `avif`, `gif`, `jpg`, `jpeg`, `png`, `webp`
- Creates `import`able manifests of generated imagesets
  (in your `src/lib` folder).
  - Output formats: `js`, `json`, `ts`
- Tooling to manage original source images and any generated files.
- Easily display imagesets with compatible UI components:
  - [web-image-gen-svelte][web-image-gen-svelte]
  - web-image-gen-react @TODO

### Features

- Dynamic image names.
- No import glob mess.
- Keep images in `static/` instead of `src/`.
- Low-quality image placeholders (LQIP).
- Cache-busting.
- Image metadata (optional) for non-visual descriptions, credits, licenses, etc.
- Web framework support:
  - Should work with most anything.
  - Author is using alongside SvelteKit and Vite.

## Usage

### Install

```sh
npm install --save-dev web-image-gen
```

### Input

Imagine a web app with the following directory structure:

```sh
.
├── package.json
├── src
│   ├── ...
│   └── lib
│       └── ...
└── static
    └── images
        ├── countries
        │   ├── italy.jpg
        │   └── italy.json
        └── fruits
            ├── pear.jpg
            └── pear.json
```

In `static/images` we have subdirectories for different groups of images
(`countries`, `fruits`). Under those subdirs we have original high-resolution
source images named for each country or fruit (`italy.jpg`, `pear.jpg`).
Alongside each original image, we have optional extra metadata in a `json` file.

### Run

We'll run the command-line script to generate our images and manifests:

```sh
npx web-image-gen generate --verbose
```

### Output

The directory structure of our web app will now look like this:

```sh
.
├── src
│   ├── ...
│   └── lib
│       └── assets
│           └── images
│               └── _gen
│                   ├── countries.json
│                   └── fruits.json
└── static
    └── images
        ├── countries
        │   ├── _gen
        │   │   ├── italy-400.avif
        │   │   ├── italy-400.jpg
        │   │   ├── italy-400.webp
        │   │   ├── italy-800.avif
        │   │   ├── italy-800.jpg
        │   │   └── italy-800.webp
        │   ├── italy.jpg
        │   └── italy.json
        └── fruits
            ├── _gen
            │   ├── pear-400.avif
            │   ├── pear-400.jpg
            │   ├── pear-400.webp
            │   ├── pear-800.avif
            │   ├── pear-800.jpg
            │   └── pear-800.webp
            ├── pear.jpg
            └── pear.json
```

The new `_gen` folders contain our generated images and manifests.

### Import

We can now import the generated manifest files to load imageset data in our
web app:

```js
import fruitImageSets from 'src/lib/assets/images/_gen/fruits.json'

console.dir(fruitImageSets['pear'])
```

Outputs:

```js
{
  default: '/images/fruits/_gen/pear-800.jpg?v=54321',
  formats: {
    avif: {
      400: '/images/fruits/_gen/pear-400.avif?v=54321',
      800: '/images/fruits/_gen/pear-800.avif?v=54321'
    },
    webp: {
      400: '/images/fruits/_gen/pear-400.webp?v=54321',
      800: '/images/fruits/_gen/pear-800.webp?v=54321'
    },
    jpg: {
      400: '/images/fruits/_gen/pear-400.jpg?v=54321',
      800: '/images/fruits/_gen/pear-800.jpg?v=54321'
    }
  },
  meta: {
    author: 'PhotographerPerson',
    authorLink: 'https://pixabay.com/users/PhotographerPerson/',
    link: 'https://pixabay.com/photos/fruit-pear-pear/',
    title: 'Pear Basket',
    license: 'Pixabay',
    licenseLink: 'https://pixabay.com/service/license/'
  },
  placeholder: 'data:image/webp;base64,UklGASDFRngA...LowrlqAAA=',
  sizes: {
    400: {
      avif: '/images/fruits/_gen/pear-400.avif?v=54321',
      webp: '/images/fruits/_gen/pear-400.webp?v=54321',
      jpg: '/images/fruits/_gen/pear-400.jpg?v=54321'
    },
    800: {
      avif: '/images/fruits/_gen/pear-800.avif?v=54321',
      webp: '/images/fruits/_gen/pear-800.webp?v=54321',
      jpg: '/images/fruits/_gen/pear-800.jpg?v=54321'
    }
  }
}
```

### Display

Compatible UI components:

- [web-image-gen-svelte][web-image-gen-svelte]
- web-image-gen-react @TODO

### Config

#### Default Config

```js
/** @type {import('web-image-gen').Config} */
{
  // Images config.
  images: {
    // Output formats - Ordered!
    //  First entry should be newest modern format, last entry should
    //  be most widely supported older fallback format.
    formats: ['avif', 'webp', 'jpg'],

    // Output width sizes in pixels.
    sizes: [400, 800],

    // Default single generated image to fallback on or use outside imageset.
    //  Must refer to a format and size defined above.
    default: {
      format: 'jpg',
      size: 800,
    },

    // Static assets folder.
    static: resolve('static'),

    // Images subdir underneath the <static> folder above.
    //  Original source subdirs and images will be read from within.
    //  Generated image files will be created within (under <slug> dir).
    //  Root of web-serving path in browser.
    images: 'images',

    // Subdir to generate images in (under `<static>/<images>/subdir/` above).
    slug: '_gen',

    // Version update for browser cache-busting
    version: Date.now().toString(),
  },

  // Manifests config
  manifests: {
    // Manifest output format. One of `json`, `js`, or `ts`.
    format: 'json',

    // Web app source code path for code dealing with static image assets.
    //  Where manifests and subdir will be generated.
    src: resolve('src/lib/assets/images'),

    // Subdir to put generated manifests in (under <src> above).
    slug: '_gen',
  },
}

```

#### Config File

##### Standard File

If either exists, config will be read from the file and merged against
the defaults:

- `.web-image-gen.js`
- `.web-image-gen.json`

##### Custom File

A custom configuration file can be used with the `--config` command-line
option (`js` or `json`). It will be merged against the default configuration.

### Help

```sh
npx web-image-gen help            # or --help
npx web-image-gen help <command>  # or <command> --help
```

### Repository

To keep generated files out of your source control repository, add to something
like a `.gitignore` file (based on our default configuration above):

```bash
src/lib/assets/images/_gen/
static/images/*/_gen/
```

Make sure to trigger generation in your `npm scripts`.

## Development

```sh
git checkout https://github.com/brev/web-image-gen.git
cd web-image-gen/packages/cli
npm install -g pnpm
pnpm install
pnpm run clean
pnpm run format
pnpm run lint
pnpm run test:cover
SNAPSHOT_UPDATE=1 pnpm run test
pnpm run build
```

## License

[MIT][mit-license]

[mit-license]: https://mit-license.org/
[web-image-gen-svelte]: https://github.com/brev/web-image-gen/tree/main/packages/svelte#readme
