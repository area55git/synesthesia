const WaveFile = require('wavefile');
const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const zeros = require('zeros');
const streamToPromise = require('stream-to-promise');
const { pack, unpack } = require('./coordinates');

// For red, green and blue
const DIMENSIONS = 3;

// Wav settings
const CHANNELS = 1;
const SAMPLE_RATE = 44100;
const BIT_DEPTH = 24;

/**
 * Accepts an image buffer and returns a promise that resolves to a wav buffer
 */

const toWav = (imageBuffer, type) =>
  new Promise((resolve, reject) => {
    getPixels(imageBuffer, type, (error, pixels) => {
      if (error) { return reject(error); }
      const samples = [];

      for (let x = 0; x < pixels.shape[0]; x += 1) {
        for (let y = 0; y < pixels.shape[1]; y += 1) {
          const red = pixels.get(x, y, 0);
          const green = pixels.get(x, y, 1);
          const blue = pixels.get(x, y, 2);

          const sample = pack([red, green, blue]);
          samples.push(sample);
        }
      }

      const wave = new WaveFile();
      wave.fromScratch(CHANNELS, SAMPLE_RATE, BIT_DEPTH, samples);

      return resolve(wave.toBuffer());
    });
  });

/**
 * Accepts a wav buffer and returns a promise that resolves to an image buffer
 */

const toImage = (buffer, width, height) => {
  const wave = new WaveFile(buffer);
  const pixels = zeros([width, height, DIMENSIONS]);

  for (let i = 0; i < wave.samples_.length; i++) {
    const [red, green, blue] = unpack(wave.samples_[i]);
    const x = i % width;
    const y = Math.floor(i / width);

    pixels.set(x, y, 0, red);
    pixels.set(x, y, 1, green);
    pixels.set(x, y, 2, blue);
  }

  return streamToPromise(savePixels(pixels, 'png'));
};

module.exports = { toWav, toImage };
