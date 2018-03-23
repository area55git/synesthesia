# toepler

[![npm version][version-badge]][version-url]
[![build status][build-badge]][build-url]
[![coverage status][coverage-badge]][coverage-url]
[![greenkeeper][greenkeeper-badge]][greenkeeper-url]
[![downloads][downloads-badge]][downloads-url]

> convert images to audio and vice versa

## Usage

#### Audio to image

```javascript
const fs = require('fs');
const path = require('path');
const { toImage } = require('toepler');

const wavBuffer = fs.readFileSync(path.join(__dirname, 'input.wav'));

toImage(wavBuffer).then(imageBuffer => {
  fs.writeFileSync(path.join(__dirname, 'output.jpg'), imageBuffer);
});
```

#### Image to audio

```javascript
const fs = require('fs');
const path = require('path');
const { toWav } = require('toepler');

const imageBuffer = fs.readFileSync(path.join(__dirname, 'input.jpg'));

toWav(imageBuffer).then(wavBuffer => {
  fs.writeFileSync(path.join(__dirname, 'output.wav'), wavBuffer);
});
```

## API

### toWav(image, [options])

Returns a `Promise<Buffer>` for a 24-bit, mono `.wav` file.

* `image`: Type: `Buffer`. Expects the `Buffer` to be a `.jpg` image by default (can be changed by setting `options.inputType`).
* `options`: Type: `Object`
  * `inputType`: Type: `string`. Default: `'image/jpeg'`. MIME type of the input image buffer. Only `'image/png'` and `'image/jpeg'` are supported. Any `.png` transparency information will be discarded.
  * `sampleRate`: Type: `number`. Default: `44100`. The sample rate of the output `.wav`.

### toImage(sound, [options])

Returns a `Promise<Buffer>` for a 24-bit `.jpg` file.

* `sound`: Type: `Buffer`. Expects a `Buffer` of a 24-bit, mono `.wav` file.
* `options`: Type: `Object`
  * `width`: Type: `number`. Minimum: `1`. The width of the image to output. If there are not enough samples to fill the image, the remaining pixels will be left black. If there are too many samples, the excess samples will be discarded. Missing dimensions will be extrapolated from the available samples and dimensions.
  * `height`: see width.
  * outputType: Type: `string`. Default: `'jpg'`. The type of image to output. Can be `'png'` or `'jpg'`

## License

[MIT](http://ismay.mit-license.org/)

[build-badge]: https://travis-ci.org/ismay/toepler.svg?branch=master
[build-url]: https://travis-ci.org/ismay/toepler
[greenkeeper-badge]: https://badges.greenkeeper.io/ismay/toepler.svg
[greenkeeper-url]: https://greenkeeper.io/
[coverage-badge]: https://coveralls.io/repos/github/ismay/toepler/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/ismay/toepler?branch=master
[downloads-badge]: https://img.shields.io/npm/dm/toepler.svg
[downloads-url]: https://www.npmjs.com/package/toepler
[version-badge]: https://img.shields.io/npm/v/toepler.svg
[version-url]: https://www.npmjs.com/package/toepler
