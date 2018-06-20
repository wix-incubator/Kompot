const babel = require('babel-core');

const code= `
import { AppRegistry } from 'react-native';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';



export default class App2 extends Component {
  render() {
    return null
  }
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'red',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// const App3 = require('/Users/niryo/git/testKompot/App2.js').default;
// AppRegistry.registerComponent('testKompot', () => App3);
`;
let result = babel.transform(code, {presets: ["es2015",'react-native','react', "stage-0"], plugins:['transform-react-jsx']});
console.log(result.code);