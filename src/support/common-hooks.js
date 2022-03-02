  const { config } = require('./config');
  const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
  const { chromium, firefox, webkit } = require('playwright');
  const { ensureDir } = require('fs-extra');
  const axios = require('axios');
let browser;
const tracesDir = 'traces';
setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);
BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
  await ensureDir(tracesDir);
});
Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped';
});
Before({ tags: '@debug' }, async function () {
  this.debug = true;
});
Before(async function ({ pickle }) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1200, height: 800 },
  });
  this.server = axios.create();
  this.server.defaults.baseURL = config.BASE_API_URL;
  this.server.defaults.headers.post = {
    'Content-Type': 'application/json',
  };
  this.server.interceptors.response.use((res) => res.data);
  // use login and set authorization if needed
  // this.server.defaults.headers.common.Authorization = 'Bearer ' + token;
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.page.on('console', async (msg) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});
After(async function ({ result }) {
  var _a, _b, _c, _d, _e, _f;
  if (result) {
    await this.attach(
      `Status: ${result === null || result === void 0 ? void 0 : result.status}. Duration:${
        (_a = result.duration) === null || _a === void 0 ? void 0 : _a.seconds
      }s`,
    );
    if (result.status !== Status.PASSED) {
      const image = await ((_b = this.page) === null || _b === void 0 ? void 0 : _b.screenshot());
      image && (await this.attach(image, 'image/png'));
      await ((_c = this.context) === null || _c === void 0
        ? void 0
        : _c.tracing.stop({
          path: `${tracesDir}/${this.testName}-${
            (_d = this.startTime) === null || _d === void 0
              ? void 0
              : _d.toISOString().split('.')[0]
          }trace.zip`,
        }));
    }
  }
  await ((_e = this.page) === null || _e === void 0 ? void 0 : _e.close());
  await ((_f = this.context) === null || _f === void 0 ? void 0 : _f.close());
});
AfterAll(async function () {
  await browser.close();
});
