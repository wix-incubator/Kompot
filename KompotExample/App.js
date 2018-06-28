
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {ChuckNorrisJokesPresenter} from './ChuckNorrisJokesPresenter';
export class App extends React.Component {
  render() {
    return (
      <View style={[StyleSheet.absoluteFillObject,  {display: 'flex', justifyContent:'center', alignItems: 'center'}]}>
      <Text style={{fontSize: 20}}>Chuck Norris Joke of the day:</Text>
        <ChuckNorrisJokesPresenter/>
      </View>
    );
  }
}

