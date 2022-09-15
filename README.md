# web-image-gen

Modern responsive web image generation and tooling.

## Functions

- Generates modern optimized web images in specified formats and sizes from
  high-resolution original source images (both in your `static` folder).
- Creates `import`able manifests of generated imagesets
  (in your `src/lib` folder).
- Tooling to manage original source images and any generated files.
- Easily display imagesets with compatible UI components:
  - Svelte LINK
  - React LINK

## Features

- Dynamic image names.
- No import glob mess.
- Low-quality image placeholders.
- Credit and license metadata.
- Cache-busting.
- Web framework support:
  - Should work with most anything.
  - Built for use alongside SvelteKit and Vite.

# Usage

## Install

```sh
npm install web-image-gen
```

## Setup

Imagine a web app with the following directory structure:

```sh
.
├── package.json
├── src
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
(countries, fruits). Under those subdirs we have high-resolution source images
named for each country or fruit (italy, pear). Alongside each original image,
we have credit and license information in a `.json` file.

## Run

We'll run the command-line script to generate our images and manifests:

```sh
npx web-image-gen generate --verbose
```

## Output

The command-line script should output verbosely:

```sh
Using default config...
Generating images and manifests...
Processing original source images dir: static/images/countries
Creating generated images dir: static/images/countries/_gen
Creating generated image file: static/images/countries/_gen/italy-400.avif
Creating generated image file: static/images/countries/_gen/italy-400.webp
Creating generated image file: static/images/countries/_gen/italy-400.jpg
Creating generated image file: static/images/countries/_gen/italy-800.avif
Creating generated image file: static/images/countries/_gen/italy-800.webp
Creating generated image file: static/images/countries/_gen/italy-800.jpg
Creating generated manifest file: src/lib/assets/images/_gen/countries.json
Processing original source images dir: static/images/fruits
Creating generated images dir: static/images/fruits/_gen
Creating generated image file: static/images/fruits/_gen/pear-400.avif
Creating generated image file: static/images/fruits/_gen/pear-400.webp
Creating generated image file: static/images/fruits/_gen/pear-400.jpg
Creating generated image file: static/images/fruits/_gen/pear-800.avif
Creating generated image file: static/images/fruits/_gen/pear-800.webp
Creating generated image file: static/images/fruits/_gen/pear-800.jpg
Creating generated manifest file: src/lib/assets/images/_gen/fruits.json
```

## Result

The directory structure of our web app will now look like this:

```sh
.
├── src
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

## Import

We can now import the generated manifest files to load imageset data in our
web app:

```js
import fruitImageSets from 'src/lib/assets/_gen/fruits.json'

console.dir(fruitImageSets['pear'])
```

Outputs:

```js
{
  credit: {
    author: 'PhotographerPerson',
    authorLink: 'https://pixabay.com/users/PhotographerPerson/',
    link: 'https://pixabay.com/photos/fruit-pear-pear/',
    title: 'Pear Basket',
    license: 'Pixabay',
    licenseLink: 'https://pixabay.com/service/license/'
  },
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

## Display

Compatible UI components:

- Svelte LINK
- React LINK

## Help

```sh
npx web-image-gen
npx web-image-gen help
npx web-image-gen --help

npx web-image-gen help <command>
npx web-image-gen <command> --help
```

## Config

### Default

```js
{
  // Images config.
  images: {
    // Output formats - Ordered!
    //  First entry should be newest modern format, last entry should
    //  be most widely supported older fallback format.
    formats: ['avif', 'webp', 'jpg'],

    // Output width sizes in pixels.
    sizes: [400, 800],

    // Default generated image to fallback on or use outside imageset.
    //  Must refer to valid formats and sizes listed above.
    default: {
      format: 'jpg',
      size: 800,
    },

    // Static assets folder.
    static: resolve('static'),

    // Images subdir underneath the `static` folder above.
    //  Root of web-serving path in browser.
    //  Home of original source image subdirs.
    //  Where generated images will be created.
    images: 'images',

    // Subdir to put generated images in (under `static`/`images`/<group>/ above)
    slug: '_gen',
  },

  // Manifests config
  manifests: {
    // Manifest output format. One of 'json', 'js', or 'ts'.
    format: 'json',

    // Web app source code path for image assets.
    //  Where manifests will be generated.
    src: resolve('src/lib/assets/images'),

    // Subdir to put generated manifests in (under `src` above).
    slug: '_gen',
  },

  // Version for cache-busting
  version: Date.now().toString(),
}

```

### File

#### Standard

TODO

#### Custom

TODO

# Development

```sh
git checkout https://github.com/brev/web-image-gen.git
cd web-image-gen

npm install -g pnpm
pnpm install
pnpm run clean
pnpm run format
pnpm run lint
pnpm run test
pnpm run build
```
