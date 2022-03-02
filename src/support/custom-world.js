const { setWorldConstructor, World } = require('@cucumber/cucumber');
class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.debug = false;
  }
}
setWorldConstructor(CustomWorld);

module.exports = {CustomWorld};