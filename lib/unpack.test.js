/* eslint-env jest */

const unpack = require('./unpack');

test('unpack the minimum sample value', () => {
  const sample = -8388608;

  expect(unpack(sample)).toEqual([0, 0, 0, 1]);
});

test('unpack a sample with a blue value', () => {
  const sample = -8388608 + 1;

  expect(unpack(sample)).toEqual([0, 0, 1, 1]);
});

test('unpack a sample with a green value', () => {
  const sample = -8388608 + 256;

  expect(unpack(sample)).toEqual([0, 1, 0, 1]);
});

test('unpack a sample with a red value', () => {
  const sample = -8388608 + 256 ** 2;

  expect(unpack(sample)).toEqual([1, 0, 0, 1]);
});

test('unpack the maximum sample value', () => {
  const sample = 8388607;

  expect(unpack(sample)).toEqual([255, 255, 255, 1]);
});
