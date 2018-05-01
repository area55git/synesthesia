/* eslint-disable no-bitwise */

const WaveFile = require('wavefile');
const getPixels = require('get-pixels');
const pack = require('int-bits');
const zeros = require('zeros');
const streamToPromise = require('stream-to-promise');
const savePixels = require('save-pixels');
const jsunicode = require('jsunicode');

/**
 * Converts an image to a Float32Array
 * @kind function
 * @param {Buffer} imageBuffer Buffer of the png image to convert
 * @returns {Promise} Resolves to a Float32Array
 */

const fromImage = imageBuffer =>
  new Promise((resolve, reject) => {
    getPixels(imageBuffer, 'image/png', (error, pixels) => {
      const values = [];

      /* istanbul ignore next */
      if (error) {
        return reject(error);
      }

      for (let y = 0; y < pixels.shape[1]; y += 1) {
        for (let x = 0; x < pixels.shape[0]; x += 1) {
          const red = pixels.get(x, y, 0);
          const green = pixels.get(x, y, 1);
          const blue = pixels.get(x, y, 2);
          const alpha = pixels.get(x, y, 3);

          const bits = (alpha << 24) | (blue << 16) | (green << 8) | red;
          const value = pack(bits & 0xfeffffff);

          values.push(value);
        }
      }

      return resolve(Float32Array.from(values));
    });
  });

/**
 * Converts a wav to a Float32Array
 * @kind function
 * @param {Buffer} wavBuffer Buffer of the wav to convert
 * @returns {Promise} Resolves to a Float32Array
 */

const fromWav = wavBuffer => {
  const wav = new WaveFile(wavBuffer);
  const values = wav.samples;

  return Promise.resolve(Float32Array.from(values));
};

/**
 * Converts text to a Float32Array
 * @kind function
 * @param {Buffer} textBuffer Buffer of the text file to convert
 * @returns {Promise} Resolves to a Float32Array
 */

const fromText = textBuffer => {
  const text = textBuffer.toString();
  const eightBitValues = jsunicode.encode(text, { encoding: 'UTF-32', byteWriter: 'byteArray' });
  const values = [];

  for (let i = 0; i < eightBitValues.length; i += 4) {
    const one = eightBitValues[i];
    const two = eightBitValues[i + 1];
    const three = eightBitValues[i + 2];
    const four = eightBitValues[i + 3];

    const bits = (one << 24) | (two << 16) | (three << 8) | four;
    const value = pack(bits & 0xfeffffff);

    values.push(value);
  }

  return Promise.resolve(Float32Array.from(values));
};

/**
 * Converts a Float32Array to an image
 * @kind function
 * @param {Float32Array} floatValues Values to convert
 * @param {Object} [options]
 * @param {number} [options.width] Width of the rendered image in pixels
 * @param {number} [options.height] Height of the rendered image in pixels
 * @returns {Promise} Resolves to a png image buffer
 */

const toImage = (floatValues, options = {}) => {
  let { width, height } = options;

  if (!width && !height) {
    width = Math.ceil(Math.sqrt(floatValues.length));
    height = Math.ceil(Math.sqrt(floatValues.length));
  }

  if (!width) {
    width = Math.ceil(floatValues.length / height);
  }

  if (!height) {
    height = Math.ceil(floatValues.length / width);
  }

  const pixels = zeros([width, height, 4]);

  for (let i = 0; i < floatValues.length; i += 1) {
    const bits = pack.unpack(floatValues[i]);
    const x = Math.round(i % width);
    const y = Math.round(Math.floor(i / width));

    const alpha = Math.floor(((bits & 0xff000000) >>> 24) * (255 / 254));
    const blue = (bits & 0x00ff0000) >>> 16;
    const green = (bits & 0x0000ff00) >>> 8;
    const red = bits & 0x000000ff;

    pixels.set(x, y, 0, red);
    pixels.set(x, y, 1, green);
    pixels.set(x, y, 2, blue);
    pixels.set(x, y, 3, alpha);
  }

  return streamToPromise(savePixels(pixels, 'png'));
};

/**
 * Converts a Float32Array to a wav
 * @kind function
 * @param {Float32Array} floatValues Values to convert
 * @param {Object} [options]
 * @param {number} [options.sampleRate] Samplerate of the rendered wav
 * @returns {Promise} Resolves to a mono, 32-bit floating point wav buffer
 */

const toWav = (values, options = {}) => {
  const sampleRate = options.sampleRate || 44100;
  const samples = Array.prototype.slice.call(values);
  const wav = new WaveFile();
  wav.fromScratch(1, sampleRate, '32f', samples);

  return Promise.resolve(wav.toBuffer());
};

/**
 * Converts a Float32Array to text
 * @kind function
 * @param {Float32Array} floatValues Values to convert
 * @returns {Promise} Resolves to a text file buffer
 */

const toText = floatValues => {
  const eightBitValues = [];

  for (let i = 0; i < floatValues.length; i += 1) {
    const bits = pack.unpack(floatValues[i]);

    const one = Math.floor(((bits & 0xff000000) >>> 24) * (255 / 254));
    const two = (bits & 0x00ff0000) >>> 16;
    const three = (bits & 0x0000ff00) >>> 8;
    const four = bits & 0x000000ff;

    eightBitValues.push(one, two, three, four);
  }

  const string = jsunicode.decode(eightBitValues, { encoding: 'UTF-32', byteReader: 'byteArray' });
  return Promise.resolve(Buffer.from(string));
};

module.exports = { fromWav, fromImage, fromText, toWav, toImage, toText };
