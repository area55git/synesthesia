const debug = require('debug')('image-to-audio');
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
const BIT_DEPTH = 24;

/**
 * Converts an image to a wavefile
 * @kind function
 * @param {Buffer} imageBuffer Buffer of the image to convert
 * @param {object} [options] Configuration options
 * @param {string} [options.inputType=image/jpeg] The mime-type of the imagebuffer
 * @param {number} [options.sampleRate=44100] The sample rate of the output wavefile
 * @returns {Promise} Resolves to a wav buffer
 */
const imageToWav = (imageBuffer, options) => {
  const defaults = {
    inputType: 'image/jpeg',
    sampleRate: 44100
  };
  const settings = Object.assign({}, defaults, options);

  return new Promise((resolve, reject) => {
    getPixels(imageBuffer, settings.inputType, (error, pixels) => {
      /* istanbul ignore next */
      if (error) {
        return reject(error);
      }
      const samples = [];

      for (let y = 0; y < pixels.shape[1]; y += 1) {
        for (let x = 0; x < pixels.shape[0]; x += 1) {
          const red = pixels.get(x, y, 0);
          const green = pixels.get(x, y, 1);
          const blue = pixels.get(x, y, 2);

          debug(`Generating sample for pixel x:${x}, y:${y}: r:${red}, g:${green}, b:${blue}`);

          const sample = pack([red, green, blue]);
          samples.push(sample);
        }
      }

      const wav = new WaveFile();
      wav.fromScratch(CHANNELS, settings.sampleRate, BIT_DEPTH, samples);

      return resolve(wav.toBuffer());
    });
  });
};

/**
 * Converts a wavefile to an image
 * @kind function
 * @param {Buffer} wavBuffer Buffer of the wavefile to convert, shouold be 24-bit and mono
 * @param {object} [options] Configuration options
 * @param {string} [options.outputType=jpg] The type of Buffer to output
 * @param {number} [options.width] The (positive) width of the output image
 * @param {number} [options.height] The (positive) height of the output image
 * @returns {Promise} Resolves to a wav buffer
 */
const wavToImage = (wavBuffer, options) => {
  const defaults = { outputType: 'jpg' };
  const settings = Object.assign({}, defaults, options);
  const wav = new WaveFile(wavBuffer);
  const availableSamples = wav.samples.length;
  const quality = settings.outputType === 'jpg' ? { quality: 100 } : undefined;

  debug(`Converting ${availableSamples} samples to image`);

  if (!settings.width && !settings.height) {
    settings.width = Math.ceil(Math.sqrt(availableSamples));
    settings.height = Math.ceil(Math.sqrt(availableSamples));
  }

  if (!settings.width) {
    settings.width = Math.ceil(availableSamples / settings.height);
  }

  if (!settings.height) {
    settings.height = Math.ceil(availableSamples / settings.width);
  }

  const pixels = zeros([settings.width, settings.height, DIMENSIONS]);

  for (let i = 0; i < availableSamples; i += 1) {
    const [red, green, blue] = unpack(wav.samples[i]);
    const x = i % settings.width;
    const y = Math.floor(i / settings.width);

    debug(`Setting colors for pixel x:${x}, y:${y}: r:${red}, g:${green}, b:${blue}`);

    pixels.set(x, y, 0, red);
    pixels.set(x, y, 1, green);
    pixels.set(x, y, 2, blue);
  }

  return streamToPromise(savePixels(pixels, settings.outputType, quality));
};

module.exports = { imageToWav, wavToImage };
