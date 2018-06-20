import { AppRegistry} from 'react-native';
import React from 'react';
import ReactNative from 'react-native';

class Container extends React.Component {
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
    return this.state.TestedComponent? <TestedComponent {...props} /> : <ReactNative.Text>Loading...</ReactNative.Text>;
  }
}

let onComponentToTestReadyListener;
let props={};
global.onComponentToTestReady = function(listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function(ComponentToTest){
  onComponentToTestReadyListener(ComponentToTest, props);
}
global.KompotApp = global.setComponentToTest;
global.React = React;
global.ReactNative = ReactNative;
global.KompotContainer = Container;

require('./generatedRequireKompotSpecs');
fakeMochaGlobals();
Promise.all([fetchAndSetGlobals(),fetchAndSetProps()]).then(() => {
  requireComponentSpecFile();
})

async function fetchAndSetGlobals(){
  try {
    const response = await fetch('http://localhost:2600/getGlobals', { method: 'GET', headers: { "Content-Type": "application/json"} });
    const globals = await response.json();
    Object.keys(globals).forEach(key => global[key] = true);
  } catch (e) {
    console.error('Cannot fetch globals: ',e.message);
  }
}

async function fetchAndSetProps(){
  try {
    const response = await fetch('http://localhost:2600/getProps', { method: 'GET', headers: { "Content-Type": "application/json"} });
    let jsonProps = await response.json();
    Object.keys(jsonProps).map(key => {
      let value = decodeURIComponent(jsonProps[key]);
      if(typeof value ==='string' && value.startsWith('FUNCTION#')){
        value = value.replace('FUNCTION#','');
        value = eval(value);
      }
      props[key] = value;
    });
  } catch (e) {
    console.error('Cannot fetch props: ',e.message);
  }
}


function fakeMochaGlobals() {
  global.afterEach = () => {};
  global.after = () => {};
  global.beforeEach = () => {};
  global.before = () => {};
  global.describe = () => {};
  global.it = () => {};
  global.xit = () => {};
  global.setup = () => {};
  global.suiteSetup = () => {};
  global.suiteTeardown = () => {};
  global.suite = () => {};
  global.teardown = () => {};
  global.test = () => {};
  global.run = () => {};
}