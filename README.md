# Kompot
A utility library for testing React Native components using Detox

## About
[Introducing Kompot](https://medium.com/@niryo/introducing-kompot-b2946243d322)

## Documentation
https://wix-incubator.github.io/Kompot

## Example
Inside `mock.js`:
```js
module.exports = {
    mockLameJoke: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  }
}
```

Inside `ChuckNorrisJokePresenter.kompot.spec.js`:
```js
const Kompot = require('kompot');
//require the component that we want to test:
const component = Kompot.kompotRequire('../ChuckNorrisJokesPresenter');
const Mocks = require(./mocks);


describe('ChuckNorrisJokesPresenter', () => {
  it('Should fetch a joke', async () => 
    await component
      .withProps({someProp: 'test'})
      .withMocks([Mocks.mockLameJoke]) //use the mock
      .mount();
    await expect(element(by.id('chuckNorrisJoke'))).toHaveText('"This is a lame Kompot joke"');
  })
});
```

## Change log
### 3.1.0 
-added spies
### 3.0.0
- support RN59
