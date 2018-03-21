// 24 bit rgb values can go from 0 to 255 per color
const VALUES_PER_AXIS = 256;

// 24 bit wave samples can go from -8388608 to 8388607
const SAMPLE_FLOOR = 8388608;

/**
 * Accepts an array of three 24 bit rgb coordinates, and packs it to a single 24 bit wav sample
 */

const pack = coordinates => {
  const [red, green, blue] = coordinates;
  const sample = red * VALUES_PER_AXIS ** 2 + green * VALUES_PER_AXIS + blue;

  return sample - SAMPLE_FLOOR;
};

/**
 * Accepts a 24 bit wav sample, and unpacks it to an array of three 24 bit rgb coordinates
 */

const unpack = sample => {
  const alignedSample = sample + SAMPLE_FLOOR;

  const red = Math.floor(alignedSample / VALUES_PER_AXIS ** 2);
  const redOffset = red * VALUES_PER_AXIS ** 2;
  const green = Math.floor((alignedSample - redOffset) / VALUES_PER_AXIS);
  const greenOffset = green * VALUES_PER_AXIS;
  const blue = alignedSample - redOffset - greenOffset;

  return [red, green, blue];
};

module.exports = { pack, unpack };
