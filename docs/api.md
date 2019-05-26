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
const Mocks = require('./mocks');

it('should do something', async () => {
  await component.withMocks([Mocks.mockLameJoke]).mount();
});
```

## Triggers
Sometimes you need to trigger functions during the tests, for example, if your react component has some method called `scrollTo` and you want to test it, you can do it using triggers. Triggers should be defined just like mocks. If you need to interact with your component, you can use the `savedComponentRef` global.

Inside your mock file add:
```js
module.exports = {
  someTrigger: () => {
    global.savedComponentRef.scrollTo('bottom');
  }
}
```

And use the trigger in your spec file like this:
```js
const Mocks = require('./mocks');
it('should do something', async () => {
  await component.withTriggers([Mocks.someTrigger]).mount();
  await element(by.id('someTrigger')).tap();
});
```

## Kompot Globals
Kompot will define a kompot global object with props and methods that you can use inside your mock files and your setup file like this: 
```js
module.exports = {
  triggerNavigationEvent:() => {
    global.kompot.savedComponentRef.onNavigationEvent('some event!');
  }
}
```

### componentProps
The props object that will be passed to the component. This object will be merged with all the props you supply to `component.withProps()`. You can use this object to pass to your component some complex props, like es6 classes.

### savedComponentRef

A ref to the mounted component.

### useMocks(mockGeneratorFunction)

Use this function inside your kompot-setup file in order to require your mock files.


### registerProvider({component, props})

Use this function inside your mocks or kompot-setup, in order to provide a store (or any other provider) to your component.

```js
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore({});
global.kompot.registerProvider({ component: Provider, props: { store } });
```

### spy(spyId: string, getReturnValue?: func ) : kompotSpy
Returns a kompot spy.
`spyId` should be a unique id that will identify the spy later in the `expect` call. 
`getReturnValue` is an optional function to use when you want to mock a return value based on the args.

For more information see the spies section below. 

### spyOn(target: object, methodName: string, spyId: string)
Attach a spy to a specific method on the target.
`target`: any object.
`methodName`: any method on the target.
`spyId` should be a unique id that will identify the spy later in the `expect` call. 


Usage:
```js
global.kompot.spyOn(global, 'fetch', 'global.fetch');
```

## Spies

If you want to spy on a function to see if it has been called, you can mock it using a kompot spy.
First, create a mock function that will mock your function to use the spy:

```js
module.exports = {
  mockSomeFunctionToUseSpy: () => {
    const Module = require('./MyModule');
    Module.someFunction = kompot.spy('someFunction'); //we give the spy a special id that we will use in the spec
  }
}
```

Then, check the spy in your spec file:
```js
const Mocks = require('./mocks');

it('should do something', async () => {
  await component.withMocks([Mocks.mockSomeFunctionToUseSpy]).mount();
  await expect(spy('someFunction')).toHaveBeenCalled();
});
```

### The spy matchers
####  toHaveBeenCalled()
Check that the function has been called
####  notToHaveBeenCalled()
Check that the function has not been called
####  toHaveBeenCalledWith(arg1,arg2, ...)
Check that the function has been called with specific args
####  toHaveBeenNthCalledWith(callNum, arg1, arg2, ...)
Check the nth call of the function