/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const equal = require('assert-dir-equal');
const WaveFile = require('wavefile');
const { toWav, toImage } = require('./convert');

it('converts a wav to jpg correctly', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [black, black, black, black, black, black, white, white, white];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-to-jpg');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer()).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('converts a jpg to wav correctly', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'jpg-to-wav');
  const imageBuffer = fs.readFileSync(path.join(fixture, 'input', 'input.jpg'));
  const black = -8388608;
  const white = 8388607;
  const expectedSamples = [black, black, black, black, black, black, white, white, white];

  expect.assertions(2);

  return toWav(imageBuffer).then(wavBuffer => {
    const wav = new WaveFile(wavBuffer);
    const availableSamples = wav.samples_.length; // eslint-disable-line no-underscore-dangle

    expect(availableSamples).toEqual(9);
    expect(wav.samples_).toEqual(expectedSamples); // eslint-disable-line no-underscore-dangle
  });
});

it('converts a wav to png correctly', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [black, black, black, black, black, black, white, white, white];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-to-png');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { outputType: 'png' }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.png'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('converts a png to wav correctly', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'png-to-wav');
  const imageBuffer = fs.readFileSync(path.join(fixture, 'input', 'input.png'));
  const black = -8388608;
  const white = 8388607;
  const expectedSamples = [black, black, black, black, black, black, white, white, white];

  expect.assertions(2);

  return toWav(imageBuffer, { inputType: 'image/png' }).then(wavBuffer => {
    const wav = new WaveFile(wavBuffer);
    const availableSamples = wav.samples_.length; // eslint-disable-line no-underscore-dangle

    expect(availableSamples).toEqual(9);
    expect(wav.samples_).toEqual(expectedSamples); // eslint-disable-line no-underscore-dangle
  });
});

it('respects width and height options', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [white, white, white, black];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-to-jpg-width-height');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { width: 1, height: 4 }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('infers width correctly when only height is set', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [white, white, white, black];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-to-jpg-infers-width');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { height: 4 }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('infers height correctly when only width is set', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [white, white, white, black];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'wav-to-jpg-infers-height');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { width: 1 }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('discards extra samples', () => {
  const wav = new WaveFile();
  const black = -8388608;
  const white = 8388607;
  const samples = [white, white, white, black, white, black];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'discards-extra-samples');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { width: 1, height: 4 }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('fills missing pixels with black', () => {
  const wav = new WaveFile();
  const white = 8388607;
  const samples = [white, white, white];

  wav.fromScratch(1, 44100, 24, samples);

  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'missing-pixels-black');
  const output = path.join(fixture, 'output');
  const expected = path.join(fixture, 'expected');

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wav.toBuffer(), { width: 1, height: 4 }).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.jpg'), imageBuffer);
    expect(() => equal(output, expected)).not.toThrow();
  });
});

it('allows you to set a sample rate', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'sample-rate');
  const imageBuffer = fs.readFileSync(path.join(fixture, 'input', 'input.jpg'));

  expect.assertions(1);

  return toWav(imageBuffer, { sampleRate: 8000 }).then(wavBuffer => {
    const wav = new WaveFile(wavBuffer);
    const sampleRate = wav.sampleRate; // eslint-disable-line prefer-destructuring

    expect(sampleRate).toEqual(8000);
  });
});
