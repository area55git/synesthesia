/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const equal = require('assert-dir-equal');
const rimraf = require('rimraf');
const WaveFile = require('wavefile');
const { fromImage, fromWav, fromText, toImage, toWav, toText } = require('.');

it('converts an image to an image lossless', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'image-conversion');
  const input = path.join(fixture, 'input');
  const output = path.join(fixture, 'output');

  const inputImagePath = path.join(input, 'image.png');
  const inputImageBuffer = fs.readFileSync(inputImagePath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromImage(inputImageBuffer)
    .then(toImage)
    .then(outputImageBuffer => {
      fs.writeFileSync(path.join(output, 'image.png'), outputImageBuffer);
      expect(() => equal(output, input)).not.toThrow();
    });
});

it('converts a wav to a wav lossless', () => {
  const inputWav = new WaveFile();
  const samples = [1, 2, 3, 4];

  inputWav.fromScratch(1, 44100, 32, samples);

  const inputWavBuffer = inputWav.toBuffer();

  expect.assertions(1);

  return fromWav(inputWavBuffer)
    .then(toWav)
    .then(outputWavBuffer => {
      const outputWav = new WaveFile(outputWavBuffer);
      expect(outputWav.data.samples).toEqual(samples);
    });
});

it('converts text to text lossless', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'text-conversion');
  const input = path.join(fixture, 'input');
  const output = path.join(fixture, 'output');

  const inputTextPath = path.join(input, 'text.txt');
  const inputTextBuffer = fs.readFileSync(inputTextPath);

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return fromText(inputTextBuffer)
    .then(toText)
    .then(outputTextBuffer => {
      fs.writeFileSync(path.join(output, 'text.txt'), outputTextBuffer);
      expect(() => equal(output, input)).not.toThrow();
    });
});

it('throws an error for wavs with invalid bit depths', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'invalid-bitdepth');
  const input = path.join(fixture, 'input');

  const inputWavPath = path.join(input, 'input.wav');
  const inputWavBuffer = fs.readFileSync(inputWavPath);

  expect.assertions(2);

  return fromWav(inputWavBuffer).catch(error => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatchSnapshot();
  });
});

it("throws an error for wavs which aren't mono", () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'invalid-channels');
  const input = path.join(fixture, 'input');

  const inputWavPath = path.join(input, 'input.wav');
  const inputWavBuffer = fs.readFileSync(inputWavPath);

  expect.assertions(2);

  return fromWav(inputWavBuffer).catch(error => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatchSnapshot();
  });
});

it('pads text to a multiple of four', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'text-pad-end');
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

it('tries to encode characters outside of windows-1252', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'invalid-text');
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
