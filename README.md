# synesthesia

[![build status][build-badge]][build-url]
[![coverage status][coverage-badge]][coverage-url]
[![greenkeeper][greenkeeper-badge]][greenkeeper-url]

> convert images, audio and text into each other

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

## License

[MIT](http://ismay.mit-license.org/)

[build-badge]: https://travis-ci.org/ismay/synesthesia.svg?branch=master
[build-url]: https://travis-ci.org/ismay/synesthesia
[greenkeeper-badge]: https://badges.greenkeeper.io/ismay/synesthesia.svg
[greenkeeper-url]: https://greenkeeper.io/
[coverage-badge]: https://coveralls.io/repos/github/ismay/synesthesia/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/ismay/synesthesia?branch=master
