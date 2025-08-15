<script>
  import { onMount, tick } from 'svelte';
  import { createOtpStore } from '../stores/otpStore.js';
  import { onlyDigits, range, clamp } from '../utils/otp.js';
  import VisuallyHidden from './VisuallyHidden.svelte';
  import OtpInput from './OtpInput.svelte';
  import OtpProgress from './OtpProgress.svelte';
  import OtpActions from './OtpActions.svelte';

  export let length = 6;
  export let label = 'Enter the 6-digit code';
  export let description = 'We sent a code to your email. Please enter it below.';
  export let name = 'otp';
  export let disabled = false;
  export let error = '';
  export let value = '';
  export let autoFocus = true;
  export let redirectUrl = '/dashboard'; // Default redirect URL

  const store = createOtpStore(length);
  let slots = Array(length).fill('');
  const inputs = [];
  let focusIndex = 0;
  let selStart = 0;
  let selEnd = 0;

  const collapseTo = (i) => { 
    focusIndex = clamp(i, 0, length - 1); 
    selStart = selEnd = focusIndex; 
  };

  const setRange = (start, end) => { 
    selStart = clamp(Math.min(start, end), 0, length - 1); 
    selEnd = clamp(Math.max(start, end), 0, length - 1); 
  };

  const hasRange = () => selEnd !== selStart;

  const focusInput = async (i) => {
    await tick();
    if (inputs[i] && typeof inputs[i].focus === 'function') {
      inputs[i].focus();
    }
  };

  const emitChange = () => {
    value = slots.join('');
    const complete = value.length === length && /^\d+$/.test(value);
    const ev = new CustomEvent('change', { detail: { value, complete } });
    dispatchEvent(ev);
    
    // If OTP is complete and valid, trigger success event
    if (complete) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000); // 1 second delay before redirect
    }
  };

  const copySelection = async (cut = false) => {
    const start = selStart;
    const end = selEnd;
    const text = slots.slice(start, end + 1).join('');
    try { 
      await navigator.clipboard.writeText(text); 
    } catch (e) { 
      console.error('Failed to copy:', e);
    }
    
    if (cut) {
      for (let i = start; i <= end; i++) slots[i] = '';
      store.set(slots);
      collapseTo(start);
      emitChange();
    }
  };

  const handleInputChange = (e) => {
    const { value, index } = e.detail;
    slots[index] = value;
    store.setAt(index, value);
    emitChange();
  };

  const handleFocus = (e) => {
    const { index } = e.detail;
    collapseTo(index);
  };

  const handleKeyDown = (e) => {
    const { event, index } = e.detail;
    const key = event.key;
    const i = index;

    if (disabled) return;

    // Navigation
    if (key === 'ArrowLeft') {
      event.preventDefault();
      if (event.shiftKey) setRange(selStart, Math.max(0, selEnd - 1));
      else collapseTo(Math.max(0, focusIndex - 1));
      focusInput(selStart);
      return;
    }

    if (key === 'ArrowRight') {
      event.preventDefault();
      if (event.shiftKey) setRange(selStart, Math.min(length - 1, selEnd + 1));
      else collapseTo(Math.min(length - 1, focusIndex + 1));
      focusInput(selEnd);
      return;
    }

    if (key === 'Home') { 
      event.preventDefault(); 
      collapseTo(0); 
      focusInput(0);
      return; 
    }

    if (key === 'End') { 
      event.preventDefault(); 
      collapseTo(length - 1); 
      focusInput(length - 1);
      return; 
    }

    // Backspace
    if (key === 'Backspace') {
      event.preventDefault();
      if (hasRange()) {
        for (let j = selStart; j <= selEnd; j++) slots[j] = '';
        store.set(slots);
        collapseTo(selStart);
        focusInput(selStart);
      } else {
        if (slots[i]) {
          slots[i] = '';
          store.setAt(i, '');
          focusInput(i);
        } else if (i > 0) {
          slots[i - 1] = '';
          store.setAt(i - 1, '');
          collapseTo(i - 1);
          focusInput(i - 1);
        }
      }
      emitChange();
      return;
    }

    // Delete
    if (key === 'Delete') {
      event.preventDefault();
      if (hasRange()) {
        for (let j = selStart; j <= selEnd; j++) slots[j] = '';
        store.set(slots);
        collapseTo(selStart);
        focusInput(selStart);
      } else {
        slots[i] = '';
        store.setAt(i, '');
      }
      emitChange();
      return;
    }

    // Clipboard
    if ((event.ctrlKey || event.metaKey) && key.toLowerCase() === 'c') { 
      event.preventDefault(); 
      copySelection(false); 
      return; 
    }
    
    if ((event.ctrlKey || event.metaKey) && key.toLowerCase() === 'x') { 
      event.preventDefault(); 
      copySelection(true); 
      return; 
    }
  };

  const handlePaste = (e) => {
    const { pasted, index } = e.detail;
    if (disabled) return;

    const digits = onlyDigits(pasted);
    const start = index;
    const end = Math.min(start + digits.length, length);
    
    for (let i = start; i < end; i++) {
      slots[i] = digits[i - start];
    }
    
    store.set(slots);
    const lastFilled = Math.min(start + digits.length, length - 1);
    collapseTo(lastFilled);
    focusInput(lastFilled);
    emitChange();
  };

  const handleFocusNext = (e) => {
    const { index } = e.detail;
    if (index < length - 1) {
      collapseTo(index + 1);
      focusInput(index + 1);
    }
  };

  const handleClear = () => {
    slots.fill('');
    store.set(slots);
    collapseTo(0);
    focusInput(0);
    emitChange();
  };

  $: store.subscribe(v => { slots = v; });
  $: digitsLeft = length - slots.filter(Boolean).length;
  $: isComplete = value && /^\d+$/.test(value) && value.length === length;

  onMount(async () => {
    if (autoFocus) await focusInput(0);
  });
</script>

<div class="w-full max-w-md mx-auto">
  <div class="bg-white rounded-2xl shadow p-6">
    <h1 class="text-2xl font-semibold text-gray-900">Two-Factor Authentication</h1>
    <p class="mt-1 text-sm text-gray-600">{description}</p>

    <form class="mt-6" autocomplete="one-time-code" aria-describedby="otp-desc" aria-invalid={!!error}>
      <VisuallyHidden as="label">{label}</VisuallyHidden>
      <p id="otp-desc" class="sr-only">{label}</p>

      <div class="grid grid-cols-6 gap-3">
        {#each range(length) as i}
          <OtpInput
            bind:this={inputs[i]}
            {length}
            index={i}
            value={slots[i]}
            {disabled}
            autoFocus={autoFocus && i === 0}
            on:change={handleInputChange}
            on:keydown={handleKeyDown}
            on:paste={handlePaste}
            on:focus={handleFocus}
            on:focusNext={handleFocusNext}
          />
        {/each}
      </div>

      <OtpProgress {digitsLeft} />

      {#if error}
        <p class="mt-3 text-sm text-red-600" role="alert">{error}</p>
      {/if}

      <OtpActions 
        {disabled} 
        {isComplete}
        on:clear={handleClear}
        on:submit={() => dispatchEvent(new CustomEvent('submit'))}
        on:resend={() => dispatchEvent(new CustomEvent('resend'))}
      />
    </form>
  </div>
</div>

<style>
  :global(input[aria-selected='true']) {
    outline: 2px solid theme('colors.brand.500');
  }
</style>