const { VALUES_PER_AXIS, SAMPLE_FLOOR } = require('./constants');

/**
 * Accepts an array of three 24 bit rgb coordinates, and packs it to a single 24 bit wav sample
 */

const pack = coordinates => {
  const [red, green, blue] = coordinates;
  const sample = red * VALUES_PER_AXIS ** 2 + green * VALUES_PER_AXIS + blue;

  return sample - SAMPLE_FLOOR;
};

module.exports = pack;
