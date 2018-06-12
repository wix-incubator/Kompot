import React, { Component } from 'react';
import { Text,View} from 'react-native';
import {test} from '../TestFramework/kompot';
export default class SomeComponent extends Component {
  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
      <Text>Nir yosef test************************!!!</Text>
      </View>
    );
  }
}
test(SomeComponent)
