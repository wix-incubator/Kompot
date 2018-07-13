# Kompot
A utility library for testing React Native components using Detox

## API:

### **KompotRequire(pathToComponent)**:
You should use this method instead of the native require in order to require you component.
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

The `default` funciton will be always activated.

### **The Component Object**:
When you require a component, you get a component object with the following props:
* **withProps(object)**: an object with the props to give the component.
* **withMocks([strings])**: an array of strings with the names of the mocks to be applied. 
* **async mount()** mount the component for the current test. 

