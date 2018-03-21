/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { toWav, toImage } = require('./convert');

it('converts a jpg to wav', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'to-wav');
  const output = path.join(fixture, 'output');
  const imageBuffer = fs.readFileSync(path.join(fixture, 'input', 'input.jpg'));

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toWav(imageBuffer, 'image/jpeg').then(wavBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.wav'), wavBuffer);
    // TODO: test if equal to expected (add expected)
    expect(true).toEqual(true);
  });
});

it('converts a wav to png', () => {
  const fixture = path.join(__dirname, '..', 'test', 'fixtures', 'to-image');
  const output = path.join(fixture, 'output');
  const wavBuffer = fs.readFileSync(path.join(fixture, 'input', 'input.wav'));

  expect.assertions(1);
  rimraf.sync(output);
  fs.mkdirSync(output);

  return toImage(wavBuffer, 10, 10).then(imageBuffer => {
    fs.writeFileSync(path.join(fixture, 'output', 'output.png'), imageBuffer);
    // TODO: test if equal to expected (add expected)
    expect(true).toEqual(true);
  });
});
