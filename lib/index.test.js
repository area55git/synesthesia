/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const equal = require('assert-dir-equal');
const rimraf = require('rimraf');
const { fromImage, fromWav, fromText, toImage, toWav, toText } = require('.');

it('converts an image to an image lossless', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'image-conversion');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputImagePath = path.join(input, 'input.png');
  const inputImageBuffer = fs.readFileSync(inputImagePath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromImage(inputImageBuffer)
    .then(toImage)
    .then(outputImageBuffer => {
      fs.writeFileSync(path.join(output, 'output.png'), outputImageBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});

it('converts a wav to a wav lossless', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-conversion');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputWavPath = path.join(input, 'input.wav');
  const inputWavBuffer = fs.readFileSync(inputWavPath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromWav(inputWavBuffer)
    .then(toWav)
    .then(outputWavBuffer => {
      fs.writeFileSync(path.join(output, 'output.wav'), outputWavBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});

it('converts text to text lossless', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'text-conversion');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputTextPath = path.join(input, 'input.txt');
  const inputTextBuffer = fs.readFileSync(inputTextPath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromText(inputTextBuffer)
    .then(toText)
    .then(outputTextBuffer => {
      fs.writeFileSync(path.join(output, 'output.txt'), outputTextBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});

it('accepts width and height options', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'image-width-height');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputImagePath = path.join(input, 'input.png');
  const inputImageBuffer = fs.readFileSync(inputImagePath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromImage(inputImageBuffer)
    .then(floats => toImage(floats, { width: 1, height: 9 }))
    .then(outputImageBuffer => {
      fs.writeFileSync(path.join(output, 'output.png'), outputImageBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});

it('infers width correctly', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'image-infers-width');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputImagePath = path.join(input, 'input.png');
  const inputImageBuffer = fs.readFileSync(inputImagePath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromImage(inputImageBuffer)
    .then(floats => toImage(floats, { height: 9 }))
    .then(outputImageBuffer => {
      fs.writeFileSync(path.join(output, 'output.png'), outputImageBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});

it('infers height correctly', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'image-infers-height');
  const input = path.join(fixture, 'input');
  const expected = path.join(fixture, 'expected');
  const output = path.join(fixture, 'output');

  const inputImagePath = path.join(input, 'input.png');
  const inputImageBuffer = fs.readFileSync(inputImagePath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromImage(inputImageBuffer)
    .then(floats => toImage(floats, { width: 1 }))
    .then(outputImageBuffer => {
      fs.writeFileSync(path.join(output, 'output.png'), outputImageBuffer);
      expect(() => equal(output, expected)).not.toThrow();
    });
});
