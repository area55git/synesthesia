# image-to-audio

[![build status][build-badge]][build-url]
[![coverage status][coverage-badge]][coverage-url]
[![greenkeeper][greenkeeper-badge]][greenkeeper-url]

> convert images to audio and vice versa

## Usage

## API

### toWav(image, [options])

Returns a `Promise<Buffer>` for a 24-bit, mono `.wav` file.

### image

Type: `Buffer`

Expects the `Buffer` to be a `.jpg` image by default. Can be changed by setting `options.type`.

### options

Type: `Object`

#### inputType

Type: `string`
Default: `'image/jpeg'`

MIME type of the input image buffer. Only `'image/png'` and `'image/jpeg'` are supported. Any `.png` transparency information will be discarded.

#### sampleRate

Type: `number`
Default: `44100`

The sample rate of the output `.wav`.

### toImage(sound, [options])

Returns a `Promise<Buffer>` for a 24-bit `.jpg` file.

#### sound

Type: `Buffer`

Expects a `Buffer` of a 24-bit, mono `.wav` file.

### options

Type: `Object`

#### width & height

Type: `number`
Minimum: `1`

The width and height of the image to output. If there are not enough samples to fill the image, the remaining pixels will be left black. If there are too many samples, the excess samples will be discarded. Missing dimensions will be extrapolated from the available samples and dimensions.

#### outputType

Type: `string`
Default: `'jpeg'`

The type of image to output. Can be `'png'` or `'jpeg'`

## License

[MIT](http://ismay.mit-license.org/)

[build-badge]: https://travis-ci.org/ismay/image-to-audio.svg?branch=master
[build-url]: https://travis-ci.org/ismay/image-to-audio
[greenkeeper-badge]: https://badges.greenkeeper.io/ismay/image-to-audio.svg
[greenkeeper-url]: https://greenkeeper.io/
[coverage-badge]: https://coveralls.io/repos/github/ismay/image-to-audio/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/ismay/image-to-audio?branch=master
