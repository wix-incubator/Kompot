# Getting Started

#### 1. install Kompot:
`npm install --save-dev kompot`

#### 2. install Detox:
[Getting Started With Detox](https://github.com/wix/detox/blob/master/docs/Introduction.GettingStarted.md)

#### 3. create some component that you want to test:
for example: `App.js`:

```js
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

```js
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
   "test": "kompot -b <your-app-name> && detox test -c <your_configuration_name>",
}
```

Replace `<your-app-name>` with the name of your app as you give to `AppRegistry.registerComponent()`, and replace `<your_configuration_name>` with your real configuration name as it appears in your package.json under `detox`.

#### 6. run:
`npm run start-kompot && npm run test`
