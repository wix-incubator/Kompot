
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../App').App;

describe('App', () => {
  it('Using global mocks file to mock a component across app (--load option) ', async () => {
    await device.reloadReactNative(); //todo: try to remove this line
    await component.mount();
    await device.reloadReactNative();
    await expect(element(by.id('mockedHeader'))).toBeVisible();
    await expect(element(by.text('Mocked Header with prop: Nir'))).toBeVisible();
  });
});