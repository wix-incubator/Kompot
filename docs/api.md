# API

## KompotRequire(pathToComponent)
You should use this method in order to require your component.

```js
const component = Kompot.kompotRequire('../App').App;
```

When you require a component, you get a `component` object with the following props:
* **withProps(object)**: an object with the props you want to supply to the component. If you pass a function as a prop, be careful not to refernce any variable outside of the function scope! Props can only be primitives or functions. If you need to pass a complex prop like es6 class, you need to use Mocks and the global `componentProps` value. 
* **withMocks([strings])**: an array of strings with the names of the mocks to be applied. 
* **withTriggers([strings])**: an array of strings with the name of the triggers to be applied.
* **async mount()** mount the component for the current test. 

You will need to mount your component on every tests:

```js
it('should do something', async () => {
  await component
    .withProps({someProp: 'hello', onPress: () => console.log('hello!')})
    .withMocks(['SOME_MOCK'])
    .withTriggers(['someTrigger'])
    .mount();
});
```

## Mocks
Mocks are just regular functions that you can pass to the KompotInjector in order to mock different functionalities.
The mocks function should not reference variables outside of their scope, but they can require any file they want.
You should define all the mocks directly in the KompotInjector object:

```js
const someVarOutOfScope = 'hello';
component.kompotInjector({
  SOME_MOCK: () => {
    const JokeService = require('../fetchJokeService');
    console.log(someVarOutOfScope) //will print undefined! don't reference out-of-scope vars!
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  }
})
```

If you want to activate some mock in some test, you need to mount the component with mocks:

```js
it('should do something', () => {
  component.withMocks(['SOME_MOCK']).mount();
});
```

You can create a `default` mock that will be activated for all the tests:

```js
component.kompotInjector({
  default: () => {
      const JokeService = require('../fetchJokeService');
      JokeService.mockSomeThing = () => console.log('This will be mocked for all tests!');
  }
});
```
## Triggers
Sometimes you need to trigger functions during the tests, for example, if your react component has some method called `scrollTo` and you want to test it, you can do using triggers. Triggers should be supplied to the kompotInjector just like mocks. If you need to interact with you component, you can use the `savedComponentRef` global.

```js
component.kompotInjector({
  someTrigger: () => {
    global.savedComponentRef.scrollTo('bottom');
  }
});
```

## Globals
Inside your KompotInjector scope you can make use of the following globals:
* **`global.componentProps`**: The props object that will be pass to the component. This object will be merged with all the props you supply to `component.withProps()`. You can use this object to pass to your component some complex props, like es6 classes.

* **`global.savedComponentRef`**: The mounted component ref.
* **`global.useMocks(mockGeneratorFunction)`**: Use this method inside your kompot-setup file in order to use conditional global mock objects (same like kompotInjector but globally injected).

**Example:**

```js
component.kompotInjector({
  SOME_MOCK: () => {
    const JokeClass = require('./Joke');
    global.componentProps.joke = JokeClass;
    global.savedComponentRef.scrollTo('bottom');
  }
})
```

## KompotInjector(Obj)
Injects the given mocks and triggers into the app.

```js
component.kompotInjector({
  default: () => { //the default function will be called for each test.
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('A mocked joke fetched from the joke service!');
    }
  },
  MOCK_LAME_JOKE: () => { //will be called only if the componet is mounting with the 'MOCK_LAME_JOKE' mock.
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  }
})
```

