module.exports ={
  getDefaultTemplate: (appName) => `
  const AppRegistry = require('react-native').AppRegistry;
  AppRegistry.registerComponent('${appName}', () => global.KompotContainer);
  `,
  getNavigationTemplate: (appName) => `
  import {Navigation} from 'react-native-navigation';
  Navigation.registerComponent('${appName}', () => global.KompotContainer);
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [{
            component: {
              name: '${appName}'
            }
          }],
          options: {
            topBar: {
              visible: false
            }
          }
        }
      }
    });
  });
  `
}

