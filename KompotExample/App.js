
import React from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {ChuckNorrisJokesPresenter} from './ChuckNorrisJokesPresenter';
import {Header} from './Header';

export class App extends React.Component {
  render() {
    return (
      <View style={[StyleSheet.absoluteFillObject,  {display: 'flex', justifyContent:'center', alignItems: 'center'}]}>
      <Header name="Nir"/>
      <Text style={{fontSize: 20}}>Chuck Norris Joke of the day:</Text>
        <ChuckNorrisJokesPresenter replaceWith="Nir"/>
        {this.props.jokeClass ? <Text testID="jokeClass">{this.props.jokeClass.getJoke()}</Text> : null}
      </View>
    );
  }
}

