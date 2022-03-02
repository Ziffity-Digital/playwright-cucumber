const { config } = require('../support/config');
const { defineStep } = require('@cucumber/cucumber');
const expect = require('expect');

defineStep('Go to the playwright website', async function () {
  const page = this.page;
  await page.goto(config.BASE_URL);
  await page.locator('nav >> a >> text="Playwright"').waitFor();
});
defineStep('Change theme to {string} mode', async function (mode) {
  const page = this.page;
  const current = await page.getAttribute('html', 'data-theme');
  if (current !== mode) {
    await page.locator('nav >> div:has(input[type="checkbox"]) >> div[role="button"]').click();
  }
  await page.waitForSelector(`html[data-theme=${mode}]`);
});
defineStep('We see {string} mode', async function (mode) {
  const page = this.page;
  const theme = await page.locator('html').getAttribute('data-theme');
  expect(theme).toEqual(mode);
});
