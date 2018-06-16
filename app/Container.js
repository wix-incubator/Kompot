
import React, { Component } from 'react';
import {Text} from 'react-native';

export class Container extends Component {
  constructor() {
    super();
    this.state= {
      TestedComponent: undefined,
      props: undefined
    }
  }
  componentDidMount() {
    global.onComponentToTestReady((TestedComponent, props) => this.setState({TestedComponent,props}));
  }
  render() {
    const TestedComponent = this.state.TestedComponent;
    const props = this.state.props;
    return this.state.TestedComponent? <TestedComponent {...props} /> : <Text>Loading...</Text>;
  }
}

