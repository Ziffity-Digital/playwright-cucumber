// Added by https://github.com/ortsevlised
const { config } = require('../support/config');
const { ensureFile, pathExists } = require('fs-extra');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
var fs = require('fs');
const { writeFileSync } = require('fs');
const { join } = require('path');

module.exports = {
getImagePath: function(customWorld, name, options) {
  var _a;
  return join(
    'screenshots',
    ((_a = customWorld.feature) === null || _a === void 0 ? void 0 : _a.uri) || '',
    (options === null || options === void 0 ? void 0 : options.skipOs) ? '' : process.platform,
    config.browser,
    `${name}.png`,
  );
},

compareToBaseImage: async function(customWorld, name, screenshot, threshold) {
  let baseImage;
  const baseImagePath = getImagePath(customWorld, name);
  const baseImgExist = await pathExists(baseImagePath);
  if (baseImgExist) {
    baseImage = PNG.sync.read(fs.readFileSync(baseImagePath));
  } else {
    await ensureFile(baseImagePath);
    writeFileSync(baseImagePath, screenshot);
    customWorld.log(
      `The base Image doesn't exist, a screenshot was taken to ${baseImagePath} so it can be used for next run`,
    );
    return;
  }
  const img1 = PNG.sync.read(screenshot);
  const difference = getDifference(img1, baseImage, threshold);
  if (difference) {
    await customWorld.attach(difference, 'image/png;base64');
    throw new Error(`Screenshot does not match : ${baseImagePath}`);
  }
},
/**
 * Returns the difference between 2 images
 * @param img1
 * @param img2
 * @param threshold the difference threshold
 */
getDifference: function(img1, img2, threshold = config.IMG_THRESHOLD) {
  const { width, height } = img2;
  const diff = new PNG({ width, height });
  const difference = pixelmatch(img1.data, img2.data, diff.data, width, height, threshold);
  if (difference > 0) {
    return PNG.sync.write(diff);
  }
  return undefined;
}


  
};