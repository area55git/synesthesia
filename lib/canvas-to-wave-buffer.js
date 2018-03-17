const WaveFile = require('wavefile');

const durationInSeconds = 3;
const channels = 1;
const sampleRate = 44100;
const bitDepth = 16;

const maxFrequency = 20000;
const yFactor = 2;

// Maximum value for a sample in a 16 bit wave file, see https://github.com/rochars/wavefile
const sampleCeiling = 32767;

const canvasToWaveBuffer = canvas => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { height, width } = imageData;

  const tmpData = [];
  let maxFreq = 0;
  const data = [];
  const numSamples = Math.round(sampleRate * durationInSeconds);
  const samplesPerPixel = Math.floor(numSamples / width);
  const C = maxFrequency / height;

  for (let x = 0; x < numSamples; x += 1) {
    let rez = 0;
    const pixelX = Math.floor(x / samplesPerPixel);

    for (let y = 0; y < height; y += yFactor) {
      const pixelIndex = (y * width + pixelX) * 4;
      const r = imageData.data[pixelIndex];
      const g = imageData.data[pixelIndex + 1];
      const b = imageData.data[pixelIndex + 2];

      const s = r + b + g;
      const volume = s * 100 / 765 ** 2;

      const freq = Math.round(C * (height - y + 1));
      rez += Math.floor(volume * Math.cos(freq * 6.28 * x / sampleRate));
    }

    tmpData.push(rez);

    if (Math.abs(rez) > maxFreq) {
      maxFreq = Math.abs(rez);
    }
  }

  for (let i = 0; i < tmpData.length; i += 1) {
    data.push(sampleCeiling * tmpData[i] / maxFreq);
  }

  const wave = new WaveFile();
  wave.fromScratch(channels, sampleRate, bitDepth, data);
  const buffer = wave.toBuffer();

  return buffer;
};

module.exports = canvasToWaveBuffer;
