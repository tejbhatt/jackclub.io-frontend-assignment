import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TwoFactorInput from '../src/lib/components/TwoFactorInput.svelte';

const getBoxes = () => screen.getAllByRole('textbox');

describe('TwoFactorInput', () => {
  it('renders 6 square boxes', async () => {
    render(TwoFactorInput, { props: { length: 6 } });
    const boxes = getBoxes();
    expect(boxes).toHaveLength(6);
    const rectLike = (el) => el.className.includes('w-16') && el.className.includes('h-16');
    expect(boxes.every(rectLike)).toBe(true);
  });

  it('accepts numeric input only', async () => {
    render(TwoFactorInput, { props: { length: 6 } });
    const boxes = getBoxes();
    await fireEvent.input(boxes[0], { target: { value: 'a1' }});
    expect(boxes[0].value).toBe('1');
  });
});
