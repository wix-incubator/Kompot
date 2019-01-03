# API

## KompotRequire(pathToComponent)
You should use this method in order to require your component.

```js
const component = Kompot.kompotRequire('../App').App;
```

When you require a component, you get a `component` object with the following methods:

### withProps(object)
 An object with the props you want to supply to the component. If you pass a function as a prop, be careful not to reference any variable outside of the function scope! Props can 
 only be primitives or functions. If you need to pass a complex prop like es6 class, you need to use Mocks and the global `componentProps` value. 

### withMocks([mockFunctions])
An array of mock functions. See the `Mocks` and `Triggers` section for more details.

### withTriggers([triggerFunctions])

An array of trigger functions. See the `Mocks` and `Triggers` section for more details.
### async mount()
mount the component for the current test. 

### Example

```js
const Mocks = require('./mocks');

it('should do something', async () => {
  await component
    .withProps({someProp: 'hello', onPress: () => console.log('hello!')})
    .withMocks([Mocks.someMock1, Mocks.someMock2])
    .withTriggers([Mocks.someTrigger])
    .mount();
});
```

## Mocks
In order to mock things and define triggers, you need to specify a mock file (or files) in your kompot-setup file:

```js
global.kompot.useMocks(() => require('./path/to/mockFile.js'));
```

The mock file looks like this:
```js
module.exports = {
  mockLameJoke: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  },
  triggerNavigationEvent:() => {
    global.savedComponentRef.onNavigationEvent('some event!');
  }
}
```

Then, you should mount your component with mocks:

```js
it('should do something', () => {
  component.withMocks(['SOME_MOCK']).mount();
});
```

## Triggers
Sometimes you need to trigger functions during the tests, for example, if your react component has some method called `scrollTo` and you want to test it, you can do it using triggers. Triggers should be defined just like mocks. If you need to interact with your component, you can use the `savedComponentRef` global.

```js
component.kompotInjector({
  someTrigger: () => {
    global.savedComponentRef.scrollTo('bottom');
  }
});
```

## Kompot Globals
Kompot will define a kompot global object with props and methods that you can use inside your mock files and your setup file like this: 
```js
component.kompotInjector({
  SOME_MOCK: () => {
    const JokeClass = require('./Joke');
    global.kompot.componentProps.joke = JokeClass;
    global.kompot.savedComponentRef.scrollTo('bottom');
  }
})
```

### componentProps
The props object that will be passed to the component. This object will be merged with all the props you supply to `component.withProps()`. You can use this object to pass to your component some complex props, like es6 classes.

### savedComponentRef

A ref to the mounted component.

### useMocks(mockGeneratorFunction)

Use this function inside your kompot-setup file in order to require your mock files.

