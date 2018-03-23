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
