
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../ChuckNorrisJokesPresenter').ChuckNorrisJokesPresenter;

describe('ChuckNorrisJokesPresenter', () => {
  beforeEach(async () => {
    await component.mount();
    await device.reloadReactNative();
  });

  it('Should have social buttons visible', async () => {
    await expect(element(by.id('chuckNorisJoke'))).toBeVisible();
  });
});