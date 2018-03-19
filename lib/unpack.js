const { VALUES_PER_AXIS, SAMPLE_FLOOR } = require('./constants');

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

module.exports = unpack;
