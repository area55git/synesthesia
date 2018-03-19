const fs = require('fs');
const path = require('path');
const imageToWave = require('./lib/image-to-wave');

const imageBuffer = fs.readFileSync(path.join(__dirname, 'images', 'input.jpg'));

imageToWave(imageBuffer, 'image/jpeg').then(waveBuffer => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'output.wav'), waveBuffer);
});
