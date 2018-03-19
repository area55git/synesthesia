const Wavefile = require('wavefile');
const savePixels = require('save-pixels');
const zeros = require('zeros');
const streamToPromise = require('stream-to-promise');
const unpack = require('./unpack');

// For red, green and blue
const DIMENSIONS = 3;

/**
 * Accepts a wav buffer and returns a promise that resolves to an image buffer
 */

const waveToImage = (buffer, width, height) => {
  const wave = new Wavefile(buffer);
  const data = zeros([width, height, DIMENSIONS]);

  for (let i = 0; i < wave.samples_.length; i++) {
    const [red, green, blue] = unpack(wave.samples_[i]);
    const x = i % width;
    const y = Math.floor(i / width);

    data.set(x, y, 0, red);
    data.set(x, y, 1, green);
    data.set(x, y, 2, blue);
  }

  return streamToPromise(savePixels(data, 'png'));
};

module.exports = waveToImage;
