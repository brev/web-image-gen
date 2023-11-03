<script lang="ts">
  import type { ImageSet as ImageSetType } from './ImageSet'

  import mime from 'mime/lite'
  import 'lazysizes'

  export let alt = ''
  export let imgClass = ''
  export let pictureClass = ''
  export let set: ImageSetType
  export let sizes = 'auto'

  if (!set) throw new Error('missing prop `set`')
</script>

<picture class="web-image-gen-picture {pictureClass}">
  {#each Object.keys(set.formats) as format}
    {@const formatSizes = set.formats[format]}
    {@const srcset = Object.keys(formatSizes)
      .map((size) => `${formatSizes[size]} ${size}w`)
      .join(', ')}
    {#if format != Object.keys(set.formats).at(-1)}
      <source
        data-sizes={sizes}
        data-srcset={srcset}
        type={mime.getType(format)}
      />
    {:else}
      <img
        {alt}
        class="web-image-gen-img {imgClass} lazyload"
        data-sizes={sizes}
        data-srcset={srcset}
        src={set.default}
        srcset={set.placeholder}
      />
    {/if}
  {/each}
</picture>
<noscript>
  <style>
    .web-image-gen-picture .web-image-gen-img.lazyload {
      display: none;
    }
  </style>
  <img {alt} class="web-image-gen-img {imgClass}" src={set.default} />
</noscript>
