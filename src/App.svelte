<script>
  import TwoFactorInput from './lib/components/TwoFactorInput.svelte';

  let code = '';
  let status = 'idle';
  let error = '';

  async function verify() {
    status = 'verifying';
    error = '';
    await new Promise(r => setTimeout(r, 650));
    if (code === '123456') {
      status = 'success';
    } else {
      error = 'Invalid code. Try again or resend a new code.';
      status = 'error';
    }
  }

  function handleResend() {
    status = 'sent';
    setTimeout(() => status = 'idle', 1000);
  }
</script>

<main class="min-h-screen grid place-items-center p-6">
  <div class="w-full max-w-md">
    <TwoFactorInput bind:value={code} on:submit={verify} on:resend={handleResend} {error} />

    <div class="mt-4 text-sm text-gray-600">
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Value:</strong> {code || '—'}</p>
    </div>
  </div>
</main>
