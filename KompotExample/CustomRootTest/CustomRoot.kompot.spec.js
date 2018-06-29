
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../Header').Header;

describe('Custom root initialization', () => {
  it('Using custom root (--init-root option) ', async () => {
    await device.reloadReactNative(); //todo: try to remove this line
    await component.mount();
    await device.reloadReactNative();
    await expect(element(by.id('customRoot'))).toBeVisible();
    await expect(element(by.id('header'))).toBeVisible();
  });
});