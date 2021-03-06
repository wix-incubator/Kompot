
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../App').App;
const Mocks = require('./mocks');

describe('App', () => {
  it('Using global mocks file to mock a component across app (--load option) ', async () => {
    await device.reloadReactNative(); //todo: try to remove this line
    await component.mount();
    await expect(element(by.id('mockedHeader'))).toBeVisible();
    await expect(element(by.text('Mocked Header with prop: Nir'))).toBeVisible();
  });

  it('mocking a prop that is a class', async () => {
    await component.withMocks([Mocks.mockClassProp]).mount();
    await expect(element(by.id('jokeClass'))).toBeVisible();
    await expect(element(by.text('a foo walks into a bar'))).toBeVisible();
  });

  it('should allow mocking fetch url', async() => {
    await component.withMocks([Mocks.mockFetchUrl]).mount();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"success mocking url!"');
  });

  describe('Spies', () => {
    it('toHaveBeenCalled', async () => {
      await component.withMocks([Mocks.spyDoSomething]).mount();
      await element(by.id('doSomething')).tap();
      await expect(spy('doSomething')).toHaveBeenCalled();
    });
    it('notToHaveBeenCalled', async () => {
      await component.withMocks([Mocks.spyDoSomething]).mount();
      await expect(spy('doSomething')).notToHaveBeenCalled();
      await expect(spy('doSomething2')).notToHaveBeenCalled();
    });
    it('toHaveBeenCalledWith', async () => {
      await component.withMocks([Mocks.spyDoSomething]).mount();
      await element(by.id('doSomething')).tap();
      await expect(spy('doSomething')).toHaveBeenCalledWith('a', 10, {test: 'bla'});
    });

    it('toHaveBeenNthCalledWith', async () => {
      await component.withMocks([Mocks.spyDoSomething]).mount();
      await element(by.id('doSomething')).tap();
      await element(by.id('doSomethingAgain')).tap();
      await expect(spy('doSomething')).toHaveBeenNthCalledWith(1, 'again');
    });

    it('should allow spying on a method', async() => {
      await component.withMocks([Mocks.mockJokeService, Mocks.spyOnLameJoke]).mount();
      await expect(spy('JokeService.fetchJoke')).toHaveBeenCalled();
    });
  });
});