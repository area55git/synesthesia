const WaveFile = require('wavefile');

const canvasToWaveBuffer = canvas => {
  const srcCanvas1 = canvas;
  const srcCtx1 = srcCanvas1.getContext('2d');
  const srcImgData1 = srcCtx1.getImageData(0, 0, srcCanvas1.width, srcCanvas1.height);
  const { height, width } = srcImgData1;

  const durationSeconds = 3;
  const tmpData = [];
  let maxFreq = 0;
  const data = [];
  const sampleRate = 44100;
  const channels = 1;
  const numSamples = Math.round(sampleRate * durationSeconds);
  const samplesPerPixel = Math.floor(numSamples / width);
  const maxSpecFreq = 20000;
  const C = maxSpecFreq / height;
  const yFactor = 2;

  for (let x = 0; x < numSamples; x += 1) {
    let rez = 0;
    const pixelX = Math.floor(x / samplesPerPixel);

    for (let y = 0; y < height; y += yFactor) {
      const pixelIndex = (y * width + pixelX) * 4;
      const r = srcImgData1.data[pixelIndex];
      const g = srcImgData1.data[pixelIndex + 1];
      const b = srcImgData1.data[pixelIndex + 2];

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
    data.push(32767 * tmpData[i] / maxFreq);
  }

  const wave = new WaveFile();
  wave.fromScratch(channels, sampleRate, 16, data);
  const buffer = wave.toBuffer();

  return buffer;
};

module.exports = canvasToWaveBuffer;
