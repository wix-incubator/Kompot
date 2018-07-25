
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
    global.fakeNavigationLib && global.fakeNavigationLib(this);
  }

  onNavigationEvent(event){
    //sometime we have methods on our component that are being triggered from outside of the component.
    //we can simulate the triggers of those method in the tests by using "withTriggers" when mounting the componnent.
    alert(event);
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

