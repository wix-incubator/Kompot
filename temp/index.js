import React, { Component } from 'react';
import { AppRegistry   ,Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  Dimensions} from 'react-native';

export default class App2 extends Component {
  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
      <Text>Nir yosef test************************!</Text>
      </View>
    );
  }
}
global.setComponentToTest(App2);