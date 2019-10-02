# Getting Started

#### 1. install Kompot:
`npm install --save-dev kompot`

#### 2. install Detox:
Follow [Getting Started With Detox](https://github.com/wix/detox/blob/master/docs/Introduction.GettingStarted.md) and choose `mocha` as the test runner (`jest` doesn't work well yet).

#### 4. create an example component:
If you follow detox's instructions correctly, you should have an 'init.js' file with a 'beforeAll' function. In the 'beforeAll' function, you should add a call to 'kompot.init()':
```js
const detox = require('detox');
const {init} = require('kompot');

beforeAll(async () => {
  await detox.init(config);
  init(); //<== add this
});

``` 

#### 5. create an example component:
for example: `App.js`:

```js
import React from 'react';
import {Text} from 'react-native';

export class App extends React.Component {
  render() {
    return <Text testID="hello">Hello world</Text>;
  }
}
```

#### 6. add your first test:
create a file called `FirstTest.kompot.spec.js`:

```js
const Kompot = require('kompot');
const component = Kompot.kompotRequire('App').App;

describe('Our first test', () => {
  it('should mount the component', async () => {
    await component.mount();
    await expect(element(by.id('hello'))).toBeVisible();
  });
});
```

#### 7. add the following scripts to your `package.json`:

```json
"scripts":{
   "start-kompot": "kompot start",
   "test": "kompot build -n <your-app-name> && detox test -c <your_configuration_name>",
}
```

Replace `<your-app-name>` with the name of your app as you give to `AppRegistry.registerComponent()`, and replace `<your_configuration_name>` with your real configuration name as it appears in your package.json under `detox`.

#### 8. run:
`npm run start-kompot && npm run test`
