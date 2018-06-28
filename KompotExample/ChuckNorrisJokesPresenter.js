
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {fetchJoke} from './fetchJokeService';

export class ChuckNorrisJokesPresenter extends React.Component {
  constructor(){
    super();
    this.state = {
      joke: ''
    }
  }
  componentWillMount(){
    fetchJoke().then(joke => this.setState({joke}))
  }
  render() {
    return (
      <View style={[ {display: 'flex', justifyContent:'center', alignItems: 'center', padding: 10}]}>
        <Text testID="chuckNorisJoke">{this.state.joke ? `"${this.state.joke}"` : '{ ... }'}</Text>
      </View>
    );
  }
}

