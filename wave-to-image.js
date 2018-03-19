const fs = require('fs');
const path = require('path');
const waveToImage = require('./lib/wave-to-image');

const waveBuffer = fs.readFileSync(path.join(__dirname, 'dist', 'output.wav'));

waveToImage(waveBuffer, 1920, 1920).then(imageBuffer => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'output.png'), imageBuffer);
});
