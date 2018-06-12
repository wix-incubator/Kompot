import React, { Component } from 'react';
import { Text,View} from 'react-native';
import {test} from '../TestFramework/kompot';
// import 'babel-polyfill';

class SomeComponent extends React.Component {
  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
      <Text>Nir yosef test************************!!!3</Text>
      </View>
    );
  }
}

describe('bla', function () {
  it('should bla', async function(){
    test(SomeComponent)
  })
})
