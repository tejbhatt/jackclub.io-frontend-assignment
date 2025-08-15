<script>
  export let as = 'span';
</script>
<svelte:element this={as} class="sr-only">
  <slot />
</svelte:element>
