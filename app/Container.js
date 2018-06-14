
import React, { Component } from 'react';
import {Text} from 'react-native';

export class Container extends Component {
  constructor() {
    super();
    this.state= {
      TestedComponent: undefined
    }
  }
  componentDidMount() {
    global.onComponentToTestReady((TestedComponent) => this.setState({TestedComponent}));
  }
  render() {
    const TestedComponent = this.state.TestedComponent;
    return this.state.TestedComponent? <TestedComponent/> : <Text>Loading...</Text>;
  }
}

