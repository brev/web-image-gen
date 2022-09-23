<script lang="ts">
  import type { ImageSet } from 'web-image-gen-common'

  import { imageContentTypes } from 'web-image-gen-common/const'
  import 'lazysizes'

  export let alt = ''
  export let imgClass = ''
  export let pictureClass = ''
  export let set: ImageSet
  export let sizes = 'auto'

  if (!set) throw new Error('missing prop `set`')
</script>

<picture class={`web-image-gen-picture ${pictureClass}`}>
  {#each Object.keys(set.formats) as format}
    {@const formatSizes = set.formats[format]}
    {@const srcset = Object.keys(formatSizes)
      .map((size) => `${formatSizes[size]} ${size}w`)
      .join(', ')}
    {#if format != Object.keys(set.formats).at(-1)}
      <source
        data-sizes={sizes}
        data-srcset={srcset}
        type={imageContentTypes[format]}
      />
    {:else}
      <img
        {alt}
        class={`web-image-gen-img ${imgClass} lazyload`}
        data-sizes={sizes}
        data-srcset={srcset}
        src={set.default}
        srcset={set.placeholder}
      />
    {/if}
  {/each}
</picture>
