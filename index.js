const fs = require('fs');
const path = require('path');
const loadToCanvas = require('./lib/load-to-canvas');
const canvasToWaveBuffer = require('./lib/canvas-to-wave-buffer');

const imagePath = path.join(__dirname, 'images', 'input.jpg');
const canvas = loadToCanvas(imagePath);
const waveBuffer = canvasToWaveBuffer(canvas);

fs.writeFileSync(path.join(__dirname, 'dist', 'output.wav'), waveBuffer);
