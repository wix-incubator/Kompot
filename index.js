import ReactNative, { ActivityIndicator, View } from 'react-native';
import React from 'react';
import {deSerialize } from './Serialize';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      TestedComponent: undefined,
      props: undefined
    }
  }
  componentDidMount() {
    global.onComponentToTestReady((TestedComponent, props) => this.setState({ TestedComponent, props }));
  }
  renderLoader() {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        flex: 1,
        justifyContent: 'center'
      }}>
        <ActivityIndicator size="large" color="black" />
      </View>);
  }

  render() {
    const TestedComponent = this.state.TestedComponent;
    const props = this.state.props;
    return this.state.TestedComponent ? <TestedComponent componentId="kompotComponent" {...props} /> :this.renderLoader();
  }
}

let onComponentToTestReadyListener;
global.componentProps = {};
global.onComponentToTestReady = function (listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function (ComponentToTest) {
  onComponentToTestReadyListener(ComponentToTest, global.componentProps);
}
global.KompotApp = global.setComponentToTest;
global.React = React;
global.ReactNative = ReactNative;
global.KompotContainer = Container;
global.kompotCodeInjector = kompotCodeInjector;

const requireComponentSpecFile = require('./generatedRequireKompotSpecs').default;
Promise.all([fetchAndSetGlobals(), fetchAndSetProps(), fetchCurrentComponent()]).then(() => {
  requireComponentSpecFile();
})

async function fetchAndSetGlobals() {
  try {
    const response = await fetch('http://localhost:2600/getGlobals', { method: 'GET', headers: { "Content-Type": "application/json" } });
    const globals = await response.json();
    Object.keys(globals).forEach(key => global[key] = true);
  } catch (e) {
    console.log('Cannot fetch globals: ', e.message);
  }
}

async function fetchCurrentComponent() {
  try {
    const response = await fetch('http://localhost:2600/getCurrentComponent', { method: 'GET', headers: { "Content-Type": "application/json" } });
    const currentComponent = await response.text();
    global[currentComponent] = true;
  } catch (e) {
    console.log('Cannot fetch currentComponent: ', e.message);
  }
}

async function fetchAndSetProps() {
  try {
    const response = await fetch('http://localhost:2600/getProps', { method: 'GET', headers: { "Content-Type": "text/plain" } });
    const stringProps = await response.text();
    global.componentProps = deSerialize(decodeURIComponent(stringProps));
  } catch (e) {
    console.log('Cannot fetch props: ', e.message);
  }
}

function kompotCodeInjector(injectorObject){
  injectorObject.default && injectorObject.default();
  Object.keys(injectorObject).forEach(key => {
    if(key !== 'default' && global[key]) {
      injectorObject[key]();
    }
  });
}
