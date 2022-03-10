const browserOptions = {
  slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

const config ={
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  BASE_URL: process.env.BASE_URL || 'https://playwright.dev',
  IMG_THRESHOLD: { threshold: 0.4 },
  recordVideos: process.env.PWVIDEO || false,
  defaultTimeout: 60 * 1000, // milliseconds
  runHeadless: false,
  runSlow: 1000, // milliseconds
};

module.exports = {config};