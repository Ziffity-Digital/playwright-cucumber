const { compareToBaseImage, getImagePath } = require('../utils/compareImages');
const { defineStep } = require('@cucumber/cucumber');
defineStep('Snapshot {string}', async function (name) {
  const { page } = this;
  await (page === null || page === void 0
    ? void 0
    : page.screenshot({ path: getImagePath(this, name) }));
});
defineStep('Snapshot', async function () {
  const { page } = this;
  const image = await (page === null || page === void 0 ? void 0 : page.screenshot());
  image && (await this.attach(image, 'image/png'));
});
defineStep('debug', async function () {
  // eslint-disable-next-line no-debugger
  debugger;
});
defineStep('Screen matches the base image {string}', async function (name) {
  var _a;
  await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForTimeout(1000));
  const screenshot = await this.page.screenshot();
  await compareToBaseImage(this, name, screenshot);
});
