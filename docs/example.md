# Example

```js
const Kompot = require('kompot');
//require the component that we want to test:
const component = Kompot.kompotRequire('../ChuckNorrisJokesPresenter');

//write some mocks:
component.kompotInjector({
  MOCK_LAME_JOKE: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  }
})

describe('ChuckNorrisJokesPresenter', () => {
  it('Should fetch a joke', async () => 
    await component
      .withProps({someProp: 'test'})
      .withMocks(['MOCK_LAME_JOKE']) //use the mock that we specified above
      .mount();
    await expect(element(by.id('chuckNorisJoke'))).toHaveText('"This is a lame Kompot joke"');
  })
});
```