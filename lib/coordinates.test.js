/* eslint-env jest */

const { pack, unpack } = require('./coordinates');

it('packs the minimum coordinates', () => {
  const coordinates = [0, 0, 0];
  const sample = -8388608;

  expect(pack(coordinates)).toEqual(sample);
});

it('packs coordinates with a blue value', () => {
  const coordinates = [0, 0, 1];
  const sample = -8388608 + 1;

  expect(pack(coordinates)).toEqual(sample);
});

it('packs coordinates with a green value', () => {
  const coordinates = [0, 1, 0];
  const sample = -8388608 + 256;

  expect(pack(coordinates)).toEqual(sample);
});

it('packs coordinates with a red value', () => {
  const coordinates = [1, 0, 0];
  const sample = -8388608 + 256 ** 2;

  expect(pack(coordinates)).toEqual(sample);
});

it('packs the maximum coordinates', () => {
  const coordinates = [255, 255, 255];
  const sample = 8388607;

  expect(pack(coordinates)).toEqual(sample);
});

it('unpacks the minimum sample value', () => {
  const coordinates = [0, 0, 0];
  const sample = -8388608;

  expect(unpack(sample)).toEqual(coordinates);
});

it('unpacks a sample with a blue value', () => {
  const coordinates = [0, 0, 1];
  const sample = -8388608 + 1;

  expect(unpack(sample)).toEqual(coordinates);
});

it('unpacks a sample with a green value', () => {
  const coordinates = [0, 1, 0];
  const sample = -8388608 + 256;

  expect(unpack(sample)).toEqual(coordinates);
});

it('unpacks a sample with a red value', () => {
  const coordinates = [1, 0, 0];
  const sample = -8388608 + 256 ** 2;

  expect(unpack(sample)).toEqual(coordinates);
});

it('unpacks the maximum sample value', () => {
  const coordinates = [255, 255, 255];
  const sample = 8388607;

  expect(unpack(sample)).toEqual(coordinates);
});
