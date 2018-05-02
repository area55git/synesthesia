const WaveFile = require('wavefile');
const getPixels = require('get-pixels');
const zeros = require('zeros');
const streamToPromise = require('stream-to-promise');
const savePixels = require('save-pixels');
const iconv = require('iconv-lite');
const hasAlpha = require('png-has-alpha');

/**
 * Converts a 24 bit png image (with transparency) to a Uint32Array
 * @kind function
 * @param {Buffer} imageBuffer Buffer of the png image to convert
 * @returns {Promise} Resolves to a Uint32Array
 */

const fromImage = imageBuffer =>
  new Promise((resolve, reject) => {
    getPixels(imageBuffer, 'image/png', (error, pixels) => {
      const octets = [];

      /* istanbul ignore next */
      if (error) {
        return reject(error);
      }

      if (!hasAlpha(imageBuffer)) {
        return reject(new Error('Input png is missing a transparency channel'));
      }

      for (let y = 0; y < pixels.shape[1]; y += 1) {
        for (let x = 0; x < pixels.shape[0]; x += 1) {
          const red = pixels.get(x, y, 0);
          const green = pixels.get(x, y, 1);
          const blue = pixels.get(x, y, 2);
          const alpha = pixels.get(x, y, 3);

          octets.push(red, green, blue, alpha);
        }
      }

      const byteArray = new ArrayBuffer(octets.length);
      const uint8 = new Uint8Array(byteArray);
      const uint32 = new Uint32Array(byteArray);

      uint8.set(octets);

      return resolve(uint32);
    });
  });

/**
 * Converts a 32 bit, mono wav to a Uint32Array
 * @kind function
 * @param {Buffer} wavBuffer Buffer of the wav to convert
 * @returns {Promise} Resolves to a Uint32Array
 */

const fromWav = wavBuffer => {
  const wav = new WaveFile(wavBuffer);
  const quadlets = wav.data.samples;

  if (wav.bitDepth !== '32') {
    return Promise.reject(new Error(`Wav file should be 32 bit, but is ${wav.bitDepth} bit`));
  }

  if (wav.fmt.numChannels !== 1) {
    return Promise.reject(
      new Error(`Wav file should be mono, but has ${wav.fmt.numChannels} channels`)
    );
  }

  const byteArray = new ArrayBuffer(quadlets.length * 4);
  const uint32 = new Uint32Array(byteArray);

  uint32.set(quadlets);

  return Promise.resolve(uint32);
};

/**
 * Converts text to a Uint32Array
 * @kind function
 * @param {Buffer} textBuffer Buffer of the text file to convert
 * @returns {Promise} Resolves to a Uint32Array
 */

const fromText = textBuffer => {
  let text = textBuffer.toString();
  const remainder = text.length % 4;

  // Pad text to a multiple of four, so it maps to 32 bit values
  if (remainder !== 0) {
    text = text.padEnd(text.length + 4 - remainder);
  }

  const encodedBuffer = iconv.encode(text, 'win1252');
  const { byteOffset } = encodedBuffer;
  const byteLength = byteOffset + encodedBuffer.byteLength;
  const byteArray = encodedBuffer.buffer.slice(byteOffset, byteLength);

  const uint32 = new Uint32Array(byteArray);

  return Promise.resolve(uint32);
};

/**
 * Converts a Uint32Array to a 24 bit png image (with transparency)
 * @kind function
 * @param {Uint32Array} quadlets Array of values to convert
 * @param {Object} [options]
 * @param {number} [options.width] Width of the rendered image in pixels
 * @param {number} [options.height] Height of the rendered image in pixels
 * @returns {Promise} Resolves to a 24 bit png image (with transparency) buffer
 */

const toImage = (quadlets, options = {}) => {
  let { width, height } = options;

  if (!width && !height) {
    width = Math.ceil(Math.sqrt(quadlets.length));
    height = Math.ceil(Math.sqrt(quadlets.length));
  }

  if (!width) {
    width = Math.ceil(quadlets.length / height);
  }

  if (!height) {
    height = Math.ceil(quadlets.length / width);
  }

  const pixels = zeros([width, height, 4]);
  const byteArray = new ArrayBuffer(quadlets.length * 4);
  const uint32 = new Uint32Array(byteArray);
  const uint8 = new Uint8Array(byteArray);

  uint32.set(quadlets);

  for (let pixel = 0; pixel < quadlets.length; pixel += 1) {
    const x = Math.round(pixel % width);
    const y = Math.round(Math.floor(pixel / width));

    const red = uint8[pixel * 4];
    const green = uint8[pixel * 4 + 1];
    const blue = uint8[pixel * 4 + 2];
    const alpha = uint8[pixel * 4 + 3];

    pixels.set(x, y, 0, red);
    pixels.set(x, y, 1, green);
    pixels.set(x, y, 2, blue);
    pixels.set(x, y, 3, alpha);
  }

  return streamToPromise(savePixels(pixels, 'png'));
};

/**
 * Converts a Uint32Array to a 32 bit, mono wav
 * @kind function
 * @param {Uint32Array} quadlets Array of values to convert
 * @param {Object} [options]
 * @param {number} [options.sampleRate=44100] Samplerate of the rendered wav
 * @returns {Promise} Resolves to a 32 bit, mono wav buffer
 */

const toWav = (quadlets, options = {}) => {
  const sampleRate = options.sampleRate || 44100;

  const wav = new WaveFile();
  wav.fromScratch(1, sampleRate, '32', quadlets);

  return Promise.resolve(wav.toBuffer());
};

/**
 * Converts a Uint32Array to text
 * @kind function
 * @param {Uint32Array} quadlets Array of values to convert
 * @returns {Promise} Resolves to a text file buffer
 */

const toText = quadlets => {
  const byteArray = new ArrayBuffer(quadlets.length * 4);
  const uint8 = new Uint8Array(byteArray);
  const uint32 = new Uint32Array(byteArray);

  uint32.set(quadlets);

  const text = iconv.decode(uint8, 'win1252');

  return Promise.resolve(Buffer.from(text));
};

module.exports = { fromWav, fromImage, fromText, toWav, toImage, toText };
