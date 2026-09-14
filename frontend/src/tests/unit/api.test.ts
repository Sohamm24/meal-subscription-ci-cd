import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice } from '../../services/api';

test('formatPrice formats numbers into INR currency string', () => {
  const formatted = formatPrice(1500);
  assert.match(formatted, /1,500/);
  assert.ok(formatted.includes('₹') || formatted.includes('INR'));
});

test('formatPrice handles zero and large values', () => {
  const zero = formatPrice(0);
  assert.match(zero, /0/);

  const large = formatPrice(99999);
  assert.match(large, /99,999/);
});
