# Kompot
A utility library for testing React Native components using Detox



## Getting Started

#### 1. install Kompot:

`npm install --save-dev kompot`

#### 2. install Detox:
[Getting Started With Detox](https://github.com/wix/detox/blob/master/docs/Introduction.GettingStarted.md)

#### 3. create some component that you want to test:
for example: `App.js`:
```javascript
import React from 'react';
import {Text} from 'react-native';

export class App extends React.Component {
  render() {
    return <Text>Hello world</Text>;
  }
}


```
#### 4. add your first test:
create a file called `FirstTest.kompot.spec.js`:

```javascript
const Kompot = require('kompot');
const component = Kompot.kompotRequire('App').App;

describe('Our first test', () => {
  it('should mount the component', async () => {
    await component.mount();
  });
});
```

#### 5. add the following scripts to your `package.json`:
```json
"scripts":{
   "start-kompot": "kompot -srk",
   "test": "npm run build-tests && detox test -c <your_configuration_name>",
}
```


#### 6. run:
`npm run start-kompot && npm run test`


## API:

### **KompotRequire(pathToComponent)**
You should use this method instead of the native require in order to require your component.
```javascript
const component = Kompot.kompotRequire('../App').App;
```

When you require a component, you get a `component` object with the following props:
* **withProps(object)**: an object with the props you want to supply to the component. If you pass a function as a prop, be careful not to refernce any variable outside of the function scope! Props can only be primitievs or simple funciton. If you need to pass a complex prop like es6 class, you need to use Mocks and the global `componentProps` value. 
* **withMocks([strings])**: an array of strings with the names of the mocks to be applied. 
* **withTriggers([strings])**: an array of strings with the name of the triggers to be applied.
* **async mount()** mount the component for the current test. 

You will need to mount your component on every tests:

```javascript
it('should do something', async () => {
  await component
    .withProps({someProp: 'hello', onPress: () => console.log('hello!')})
    .withMocks(['SOME_MOCK'])
    .withTriggers(['someTrigger'])
    .mount();
});
```

### **Mocks**
Mocks are just regular functions that you can pass to the KompotInjector in order to mock different functionalities.
The mocks function should not reference variables outside of their scope, but they can require any file they want.
You should define all the mocks directly in the KompotInjector object:

```javascript
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
```javascript
it('should do something', () => {
  component.withMocks(['SOME_MOCK']).mount();
});
```

You can create a `default` mock that will be activated for all the tests:
```javascript
component.kompotInjector({
  default: () => {
      const JokeService = require('../fetchJokeService');
      JokeService.mockSomeThing = () => console.log('This will be mocked for all tests!');
  }
});
```


### **Triggers**
Sometimes you need to trigger functions that during the tests, for example, if your react component has some method called `scrollTo` and you want to test it, you can do using triggers. Triggers should be supplied to the kompotInjector just like mocks. If you need to interact with you component, you can use the `savedComponentRef` global.

```javascript
component.kompotInjector({
  someTrigger: () => {
    global.savedComponentRef.scrollTo('bottom');
  }
})
```

### **Globals**
Inside your KompotInjector scope you can make use of the following globals:
* **`global.componentProps`**: The props object that will be pass to the component. This object will be merged with all the props you supply to `component.withProps()`. You can use this object to pass to your component some complex props, like es6 classes.

* **`global.savedComponentRef`**: The mounted component ref.

Example:

```javascript
component.kompotInjector({
  SOME_MOCK: () => {
    const JokeClass = require('./Joke');
    global.componentProps.joke = JokeClass;
    global.savedComponentRef.scrollTo('bottom');
  }
})


### **KompotInjector(Obj)**:
Injects the given mocks and triggers into the app.

```javascript
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

## Kompot cli

```
usage: kompot-cli.js [-h] [-s] [-k] [-r] [-b appName]
                     [-t {react-native-navigation}] [-i filePath]
                     [-l filePath]


Optional arguments:
  -h, --help            Show this help message and exit.
  -s, --start           Launch react-native's packager.
  -k, --kill            Kill server and packager if needed.
  -r, --run-server      Start the Kompot server on port 2600
  -b appName, --build appName
                        Scan the project for *.kompot.spec.js and process
                        them. app name should be the same name that you pass
                        to AppRegistry.registerComponent()
  -t {react-native-navigation}, --app-type {react-native-navigation}
                        Application type.
  -i filePath, --init-root filePath
                        A path to an initialization file, for custom
                        initializaion of the root component.
  -l filePath, --load filePath
                        A path to a file that will be loaded before the
                        mounting of the component. Put all global mocks in
                        this file
```



## Example:
```javascript
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
