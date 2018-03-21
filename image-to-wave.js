const fs = require('fs');
const path = require('path');
const { toWav } = require('./lib/convert');

const imageBuffer = fs.readFileSync(path.join(__dirname, 'images', 'input.jpg'));

toWav(imageBuffer, 'image/jpeg').then(waveBuffer => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'output.wav'), waveBuffer);
});
