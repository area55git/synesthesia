const fs = require('fs');
const path = require('path');
const { toImage } = require('./lib/convert');

const waveBuffer = fs.readFileSync(path.join(__dirname, 'dist', 'output.wav'));

toImage(waveBuffer, 1920, 1920).then(imageBuffer => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'output.png'), imageBuffer);
});
