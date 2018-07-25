import ReactNative, { ActivityIndicator, View, Dimensions, Button} from 'react-native';
import React from 'react';
import {deSerialize } from './Serialize';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      TestedComponent: undefined,
      props: undefined,
      triggers: []
    }
  }
  componentDidMount() {
    global.onComponentToTestReady((TestedComponent, props, triggers) => this.setState({ TestedComponent, props, triggers}));
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
  onTriggerPressed(trigger){
    global.triggers[trigger] && global.triggers[trigger]();
  }
  renderComponent(){
    const TestedComponent = this.state.TestedComponent;
    const props = this.state.props;

    return (
    <View style={{height: Dimensions.get('window').height}}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
      {this.state.triggers.map(trigger => <Button testID={trigger} onPress={() => this.onTriggerPressed(trigger)} title="."/>)}
      </View>
      <TestedComponent componentId="kompotComponent" {...props} />
    </View>);
  }

  render() {
    return this.state.TestedComponent ? this.renderComponent() :this.renderLoader();
  }
}

let onComponentToTestReadyListener;
global.componentProps = {};
global.onComponentToTestReady = function (listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function (ComponentToTest) {
  onComponentToTestReadyListener(ComponentToTest, global.componentProps, Object.keys(global.triggers));
}
global.KompotApp = global.setComponentToTest;
global.React = React;
global.ReactNative = ReactNative;
global.KompotContainer = Container;
global.kompotCodeInjector = kompotCodeInjector;
global.triggers = {};

const requireComponentSpecFile = require('./generatedRequireKompotSpecs').default;
Promise.all([fetchAndSetTriggers(), fetchAndSetGlobals(), fetchAndSetProps(), fetchCurrentComponent()]).then(() => {
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

async function fetchAndSetTriggers() {
  try {
    const response = await fetch('http://localhost:2600/getTriggers', { method: 'GET', headers: { "Content-Type": "application/json" } });
    const triggersObj = await response.json();
    Object.keys(triggersObj).forEach(key => global.triggers[key] = true);
  } catch (e) {
    console.log('Cannot fetch triggers: ', e.message);
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
    if(global.triggers[key]){
      global.triggers[key] = injectorObject[key];
    }
  });
}
