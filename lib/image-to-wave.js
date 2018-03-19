const WaveFile = require('wavefile');
const getPixels = require('get-pixels');
const pack = require('./pack');

// Wav settings
const CHANNELS = 1;
const SAMPLE_RATE = 44100;
const BIT_DEPTH = 24;

/**
 * Accepts a pixels ndarray, returns a 24 bit wav buffer
 * TODO: switch to using a buffer as input
 */

const imageToWave = (imageBuffer, type) => {
  return new Promise((resolve, reject) => {
    getPixels(imageBuffer, type, (error, pixels) => {
      if (error) {
        return reject(error);
      }

      const waveData = [];

      for (let x = 0; x < pixels.shape[0]; x++) {
        for (let y = 0; y < pixels.shape[1]; y++) {
          const red = pixels.get(x, y, 0);
          const green = pixels.get(x, y, 1);
          const blue = pixels.get(x, y, 2);

          const sample = pack([red, green, blue]);
          waveData.push(sample);
        }
      }

      const wave = new WaveFile();
      wave.fromScratch(CHANNELS, SAMPLE_RATE, BIT_DEPTH, waveData);

      return resolve(wave.toBuffer());
    });
  });
};

module.exports = imageToWave;
