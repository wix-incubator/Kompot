module.exports ={
  getDefaultTemplate: (appName) => `
  const AppRegistry = require('react-native').AppRegistry;
  AppRegistry.registerComponent('${appName}', () => global.KompotContainer);
  `,
  getNavigationTemplate: (appName) => `
  import {Navigation} from 'react-native-navigation';
  global.isReactNativeNavigationProject = true;
  global.registerComponentAsRoot = (name, Component, props) => {
    Navigation.registerComponent(name, () => Component);
    Navigation.setRoot({
      root: {
        stack: {
          children: [{
            component: {
              id: name,
              name,
              passProps: props
            }
          }]
        }
      }
    });
  }

  Navigation.events().registerAppLaunchedListener(() => global.registerComponentAsRoot('${appName}', global.KompotContainer));
  `
}

