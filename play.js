const fs = require('fs');
const path = require('path');
const wav = require('wav');
const Speaker = require('speaker');

const file = fs.createReadStream(path.join(__dirname, 'dist', 'output.wav'));
const reader = new wav.Reader();

reader.on('format', (format) => {
  reader.pipe(new Speaker(format));
});

file.pipe(reader);
