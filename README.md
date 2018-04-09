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

<dl>
<dt><a href="#toWav">toWav(imageBuffer, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Converts an image to a wavefile</p>
</dd>
<dt><a href="#toImage">toImage(wavBuffer, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Converts a wavefile to an image</p>
</dd>
</dl>

<a name="toWav"></a>

## toWav(imageBuffer, [options]) ⇒ <code>Promise</code>
Converts an image to a wavefile

**Kind**: global function
**Returns**: <code>Promise</code> - Resolves to a wav buffer

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imageBuffer | <code>Buffer</code> |  | Buffer of the image to convert |
| [options] | <code>object</code> |  | Configuration options |
| [options.inputType] | <code>string</code> | <code>&quot;image/jpeg&quot;</code> | The mime-type of the imagebuffer |
| [options.sampleRate] | <code>number</code> | <code>44100</code> | The sample rate of the output wavefile |

<a name="toImage"></a>

## toImage(wavBuffer, [options]) ⇒ <code>Promise</code>
Converts a wavefile to an image

**Kind**: global function
**Returns**: <code>Promise</code> - Resolves to a wav buffer

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| wavBuffer | <code>Buffer</code> |  | Buffer of the wavefile to convert, shouold be 24-bit and mono |
| [options] | <code>object</code> |  | Configuration options |
| [options.outputType] | <code>string</code> | <code>&quot;jpg&quot;</code> | The type of Buffer to output |
| [options.width] | <code>number</code> |  | The (positive) width of the output image |
| [options.height] | <code>number</code> |  | The (positive) height of the output image |

## Contributing

Generate these docs with `npx jsdoc-to-markdown`

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
