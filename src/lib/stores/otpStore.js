import { writable } from 'svelte/store';

export function createOtpStore(length = 6) {
  const { subscribe, set, update } = writable(Array(length).fill(''));

  return {
    subscribe,
    set,
    reset: () => set(Array(length).fill('')),
    setAt: (idx, val) => update(arr => {
      const next = arr.slice();
      next[idx] = val;
      return next;
    }),
    setMany: (start, vals) => update(arr => {
      const next = arr.slice();
      for (let i = 0; i < vals.length; i++) {
        const pos = start + i;
        if (pos < next.length) next[pos] = vals[i];
      }
      return next;
    }),
  };
}
