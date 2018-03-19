// 24 bit rgb values can go from 0 to 255 per color
const VALUES_PER_AXIS = 256;

// 24 bit wave samples can go from -8388608 to 8388607
const SAMPLE_FLOOR = 8388608;

module.exports = { SAMPLE_FLOOR, VALUES_PER_AXIS };
