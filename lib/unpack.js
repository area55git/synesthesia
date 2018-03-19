const alpha = 1;

// rgb values can go from 0 to 255 per color
const valuesPerAxis = 256;

// 24 bit wave samples can go from -8388608 to 8388607
const sampleFloor = 8388608

const unpack = sample => {
  const alignedSample = sample + sampleFloor;

  const red = Math.floor(alignedSample / valuesPerAxis ** 2);
  const redOffset = red * valuesPerAxis ** 2;

  const green = Math.floor((alignedSample - redOffset) / valuesPerAxis);
  const greenOffset = green * valuesPerAxis;

  const blue = alignedSample - redOffset - greenOffset;

  return [red, green, blue, alpha];
}

module.exports = unpack;
