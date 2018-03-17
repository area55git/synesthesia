const fs = require('fs');
const { Image, createCanvas } = require('canvas');

const loadToCanvas = imagePath => {
  const buffer = fs.readFileSync(imagePath);
  const img = new Image();

  img.src = buffer;

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, img.width, img.height);

  return canvas;
};

module.exports = loadToCanvas;
