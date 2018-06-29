
import React from 'react';
import {Text,View, TouchableOpacity} from 'react-native';
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

  getJokeText(){
    let text = '{ ... }';
    if(this.state.joke){
      text = this.state.joke;
      if(this.props.replaceWith){
        text = this.state.joke.replace(/Chuck Norris/g, this.props.replaceWith);
      } 
      text = `"${text}"`
    }
    return text;
  }
  render() {
    return (
      <View style={[ {display: 'flex', justifyContent:'center', alignItems: 'center', padding: 10}]}>
      <TouchableOpacity testID="clickable" onPress={() => this.props.onPress && this.props.onPress()}>
        <Text testID="chuckNorisJoke">{this.getJokeText()}</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

