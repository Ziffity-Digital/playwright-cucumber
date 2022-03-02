const expect = require('expect');
const { defineStep } = require('@cucumber/cucumber');
defineStep('A bored activity is recieved', async function () {
  var _a;
  const response = await ((_a = this.server) === null || _a === void 0
    ? void 0
    : _a.get('activity'));
  expect(response).toBeDefined();
});
