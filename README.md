# Kompot
A utility library for testing React Native components using Detox

## Installation 

`npm install --save-dev kompot`
## Example:
```
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
## API:

### **KompotRequire(pathToComponent)**:
You should use this method instead of the native require in order to require your component.
```javascript
const component = Kompot.kompotRequire('../App').App;
```

See below about the returned **component** object.

### **KompotInjector(Obj)**:
Use this function when you need to mock things.

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
You can decide which mock will be activated when you are mounting the component with mocks:
```javascript
component.withMocks(['MOCK_LAME_JOKE']).mount();
```

The `default` mock will be always activated.

### **The Component Object**:
When you require a component, you get a component object with the following props:
* **withProps(object)**: an object with the props to give the component.
* **withMocks([strings])**: an array of strings with the names of the mocks to be applied. 
* **async mount()** mount the component for the current test. 


## Kompot cli:

```
usage: kompot [-h] [-s] [-r] [-b appName] [-t {react-native-navigation}]
              [-i filePath] [-l filePath]


Optional arguments:
  -h, --help            Show this help message and exit.
  -s, --start           Launch react-native's packager.
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
```
