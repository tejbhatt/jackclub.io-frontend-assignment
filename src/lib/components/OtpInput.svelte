<script>
  import { createEventDispatcher } from 'svelte';
  import { onlyDigits } from '../utils/otp.js';

  export let value = '';
  export let index = 0;
  export let length = 6;
  export let disabled = false;
  export let autoFocus = false;
  
  const dispatch = createEventDispatcher();
  let input;

  function handleInput(e) {
    const v = onlyDigits(e.target.value).slice(-1);
    dispatch('change', { value: v, index });
    if (v && index < length - 1) {
      dispatch('focusNext', { index });
    }
  }

  function handleKeyDown(e) {
    if (disabled) return;

    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace', 'Delete'].includes(e.key)) {
      e.preventDefault();
      dispatch('keydown', { 
        event: e, 
        index 
      });
    }
  }

  function handlePaste(e) {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    dispatch('paste', { pasted, index });
  }

  function handleFocus() {
    dispatch('focus', { index });
  }

  // Expose focus method
  function focus() {
    input?.focus();
    input?.select();
  }
  
  // Expose the focus method to parent components
  export { focus };
</script>

<input
  bind:this={input}
  class="w-16 h-16 rounded-xl border text-center text-2xl font-semibold tracking-wider 
         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 
         disabled:opacity-50 disabled:cursor-not-allowed"
  inputmode="numeric"
  pattern="\d*"
  aria-label={`Digit ${index + 1} of ${length}`}
  maxlength="1"
  {value}
  {disabled}
  on:input={handleInput}
  on:keydown={handleKeyDown}
  on:paste={handlePaste}
  on:focus={handleFocus}
  autofocus={autoFocus}
/>
