<script lang="ts">
  export let alt: string = ''
  export let set: any // @TODO typing

  if (!set) throw new Error('missing prop `set`')

  const contentTypes = {} // @TODO
</script>

<picture>
  {#each Object.keys(set.formats) as format}
    {@const sizes = set.formats[format]}
    {@const srcset = Object.keys(sizes)
      .map((size) => `${sizes[size]} ${size}w`)
      .join(', ')}
    {#if format != Object.keys(set.formats).at(-1)}
      <source
        data-sizes="auto"
        data-srcset={srcset}
        type={contentTypes[format]}
      />
    {:else}
      <img
        {alt}
        class="lazyload sveltekit-imagegen"
        data-sizes="auto"
        data-srcset={srcset}
        src={set.default}
        srcset={set.placeholder}
      />
    {/if}
  {/each}
</picture>
