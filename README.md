# synesthesia

[![build status][build-badge]][build-url]
[![coverage status][coverage-badge]][coverage-url]
[![greenkeeper][greenkeeper-badge]][greenkeeper-url]

> convert images, audio and text into eachother

## Usage

#### Audio to image

```javascript
const fs = require('fs');
const path = require('path');
const { wavToImage } = require('synesthesia');

const wavBuffer = fs.readFileSync(path.join(__dirname, 'input.wav'));

wavToImage(wavBuffer).then(imageBuffer => {
  fs.writeFileSync(path.join(__dirname, 'output.jpg'), imageBuffer);
});
```

#### Image to audio

```javascript
const fs = require('fs');
const path = require('path');
const { imageToWav } = require('synesthesia');

const imageBuffer = fs.readFileSync(path.join(__dirname, 'input.jpg'));

imageToWav(imageBuffer).then(wavBuffer => {
  fs.writeFileSync(path.join(__dirname, 'output.wav'), wavBuffer);
});
```

## API

<dl>
<dt><a href="#imageToWav">imageToWav(imageBuffer, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Converts an image to a wavefile</p>
</dd>
<dt><a href="#wavToImage">wavToImage(wavBuffer, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Converts a wavefile to an image</p>
</dd>
</dl>

<a name="imageToWav"></a>

## imageToWav(imageBuffer, [options]) ⇒ <code>Promise</code>
Converts an image to a wavefile

**Kind**: global function
**Returns**: <code>Promise</code> - Resolves to a wav buffer

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imageBuffer | <code>Buffer</code> |  | Buffer of the image to convert |
| [options] | <code>object</code> |  | Configuration options |
| [options.inputType] | <code>string</code> | <code>&quot;image/jpeg&quot;</code> | The mime-type of the imagebuffer |
| [options.sampleRate] | <code>number</code> | <code>44100</code> | The sample rate of the output wavefile |

<a name="wavToImage"></a>

## wavToImage(wavBuffer, [options]) ⇒ <code>Promise</code>
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

[build-badge]: https://travis-ci.org/ismay/synesthesia.svg?branch=master
[build-url]: https://travis-ci.org/ismay/synesthesia
[greenkeeper-badge]: https://badges.greenkeeper.io/ismay/synesthesia.svg
[greenkeeper-url]: https://greenkeeper.io/
[coverage-badge]: https://coveralls.io/repos/github/ismay/synesthesia/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/ismay/synesthesia?branch=master
