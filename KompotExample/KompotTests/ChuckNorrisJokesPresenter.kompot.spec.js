
const Kompot = require('kompot');
const component = Kompot.kompotRequire('../ChuckNorrisJokesPresenter').ChuckNorrisJokesPresenter;
component.kompotInjector({
  default: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('A mocked joke fetched from the joke service!');
    }
  },
  MOCK_LAME_JOKE: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  },
  triggerNavigationEvent:() => {
    global.savedComponentRef.onNavigationEvent('some event!');
  }
})

describe('ChuckNorrisJokesPresenter', () => {
  it('Sanity check', async () => {
    await component.mount();
    await expect(element(by.id('chuckNorisJoke'))).toBeVisible();
  });

  it('Mocking a required module', async () => {
    await component.mount();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"A mocked joke fetched from the joke service!"');
  })

  it('Using triggers', async () => {
    await component.withTriggers(['triggerNavigationEvent']).mount();
    await element(by.id('triggerNavigationEvent')).tap();
    await expect(element(by.text('some event!'))).toBeVisible();
  })

  it('Using a specific mock for test', async () => {
    await component.withMocks(['MOCK_LAME_JOKE']).mount();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"This is a lame Chuck Norris joke"');
  })

  it('Passing basic prop', async () => {
    await component
      .withProps({replaceWith: 'Kompot'})
      .withMocks(['MOCK_LAME_JOKE'])
      .mount();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"This is a lame Kompot joke"');
  })

  it('Passing a function as a prop', async () => {
    await component
      .withProps({onPress: () => alert('onPress clicked!')})
      .mount();
    await element(by.id('clickable')).tap();
    await expect(element(by.text('onPress clicked!'))).toBeVisible();
  })

  it('Chaining order does not matter', async () => {
    await component
      .withProps({onPress: () => alert('onPress clicked!')})
      .withMocks(['MOCK_LAME_JOKE'])
      .withProps({replaceWith: 'Kompot'})
      .mount();
    await element(by.id('clickable')).tap();
    await expect(element(by.text('onPress clicked!'))).toBeVisible();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"This is a lame Kompot joke"');
  })
});