<script>
  import { createEventDispatcher } from 'svelte';
  
  export let disabled = false;
  export let isComplete = false;
  
  const dispatch = createEventDispatcher();
  
  function handleClear() {
    dispatch('clear');
  }
  
  function handleSubmit() {
    dispatch('submit');
  }
  
  function handleResend() {
    dispatch('resend');
  }
</script>

<div class="mt-6 flex items-center gap-3">
  <button 
    type="button" 
    class="px-4 py-2 rounded-2xl bg-brand-500 text-white font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500" 
    on:click={handleSubmit} 
    disabled={disabled || !isComplete}
  >
    Verify
  </button>
  
  <button 
    type="button" 
    class="px-4 py-2 rounded-2xl border font-medium hover:bg-gray-50" 
    on:click={handleClear} 
    {disabled}
  >
    Clear
  </button>
  
  <button 
    type="button" 
    class="ml-auto text-sm underline" 
    on:click={handleResend} 
    {disabled}
  >
    Resend code
  </button>
</div>
