import ReactNative, {ActivityIndicator, View, Dimensions, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {deSerialize} from './Serialize';
import hoistNonReactStatics from 'hoist-non-react-statics';
const originalFetch = fetch;
const providers = [];

const renderTriggers = (triggers) => {
  const onTriggerPressed = (trigger) =>  global.triggers[trigger] && global.triggers[trigger]();
  return (
    <View style={{position: 'absolute', display: 'flex'}}>
    {triggers.map(trigger => {
      return (
        <TouchableOpacity
          style={{display: 'flex', zIndex: 9999, top: Dimensions.get('window').height / 2, width: 4, height: 1, backgroundColor: 'red'}}
          key={trigger}
          testID={trigger}
          onPress={() => onTriggerPressed(trigger)} />
      );
    })}
  </View>
  );
}

const getWrappedComponent = (Component, props, triggers) => {
  let TestedComponent = (
    <View style={{height: Dimensions.get('window').height}}>
      {renderTriggers(triggers)}
      <Component ref={(ref) => global.savedComponentRef = ref} {...props} />
    </View>);
  providers.forEach(provider => {
    TestedComponent = <provider.component {...provider.props}>{TestedComponent}</provider.component>;
  });
  return TestedComponent;
}

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      TestedComponent: undefined
    }
  }
  componentDidMount() {
    global.onComponentToTestReady((TestedComponent, props, triggers) => {
      if (global.isReactNativeNavigationProject) {
        const Wrapper = (wrapperProps) => {
          return getWrappedComponent(TestedComponent, {...wrapperProps, ...props}, triggers);
        }
        hoistNonReactStatics(Wrapper, TestedComponent);
        global.registerComponentAsRoot('kompotComponent' ,Wrapper);
      } else {
        this.setState({TestedComponent: getWrappedComponent(TestedComponent,props,triggers)});
      }
    });
    run();
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
  
  renderComponent() {
    return (
      <View style={{height: Dimensions.get('window').height}}>
        {this.state.TestedComponent}
      </View>);
  }

  render() {
    return this.state.TestedComponent ? this.renderComponent() : this.renderLoader();
  }
}

let onComponentToTestReadyListener;
let requireGlobalMocks = [];
global.componentProps = {};
global.onComponentToTestReady = function (listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function (ComponentToTest) {
  onComponentToTestReadyListener(ComponentToTest, global.componentProps, Object.keys(global.triggers));
}
global.fetch = mockedFetch;
global.KompotApp = global.setComponentToTest;
global.React = React;
global.ReactNative = ReactNative;
global.KompotContainer = Container;
global.kompotCodeInjector = kompotCodeInjector;
global.savedComponentRef = null;
global.triggers = {};
global.useMocks = getMocks => requireGlobalMocks.push(getMocks);
global.kompot = {
  mockFetchUrl,
  spy: kompotSpy,
  spyOn,
  useMocks: global.useMocks,
  savedComponentRef: global.savedComponentRef,
  componentProps: global.componentProps,
  registerProvider: (provider) => providers.push(provider),
};
const requireComponentSpecFile = require('./generatedRequireKompotSpecs').default;
function run() {
  Promise.all([fetchAndSetTriggers(), fetchAndSetGlobals(), fetchAndSetProps(), fetchCurrentComponent()]).then(() => {
    requireComponentSpecFile();
  })
}

async function fetchAndSetGlobals() {
  try {
    const response = await originalFetch('http://localhost:2600/getGlobals', {method: 'GET', headers: {"Content-Type": "application/json"}});
    const globals = await response.json();
    Object.keys(globals).forEach(key => global[key] = true);
  } catch (e) {
    console.log('Cannot fetch globals: ', e.message);
  }
}

async function fetchAndSetTriggers() {
  try {
    const response = await originalFetch('http://localhost:2600/getTriggers', {method: 'GET', headers: {"Content-Type": "application/json"}});
    const triggersObj = await response.json();
    Object.keys(triggersObj).forEach(key => global.triggers[key] = true);
  } catch (e) {
    console.log('Cannot fetch triggers: ', e.message);
  }
}

async function fetchCurrentComponent() {
  try {
    const response = await originalFetch('http://localhost:2600/getCurrentComponent', {method: 'GET', headers: {"Content-Type": "application/json"}});
    const currentComponent = await response.text();
    global[currentComponent] = true;
  } catch (e) {
    console.log('Cannot fetch currentComponent: ', e.message);
  }
}

async function fetchAndSetProps() {
  try {
    const response = await originalFetch('http://localhost:2600/getProps', {method: 'GET', headers: {"Content-Type": "text/plain"}});
    const stringProps = await response.text();
    global.componentProps = deSerialize(decodeURIComponent(stringProps));
  } catch (e) {
    console.log('Cannot fetch props: ', e.message);
  }
}

async function notifySpyTriggered(body) {
  try {
    await originalFetch('http://localhost:2600/notifySpy', {method: 'POST', body, headers: {"Content-Type": "application/json"}});
  } catch (e) {
    console.log('Cannot set spy: ', e.message);
  }
}

function kompotCodeInjector() {
  const mocks = requireGlobalMocks.map(getMocks => getMocks());
  const injectorObject = Object.assign({}, ...mocks);
  injectorObject.default && injectorObject.default();
  Object.keys(injectorObject).forEach(key => {
    if (key !== 'default' && global[key]) {
      injectorObject[key]();
    }
    if (global.triggers[key]) {
      global.triggers[key] = injectorObject[key];
    }
  });
}

function kompotSpy(id, getReturnValue, stringifyArgs) {
  return (...args) => {
    let stringArgs = stringifyArgs && stringifyArgs(...args) || JSON.stringify(args);
    notifySpyTriggered(JSON.stringify({id, stringArgs}));
    if (getReturnValue) {
      return getReturnValue(...args);
    }
  }
}

function spyOn(object, methodName, spyId, stringifyArgs) {
  const originalFunc = object[methodName];
  const spy = kompotSpy(spyId, undefined, stringifyArgs);

  object[methodName] = (...args) => {
    spy(...args);
    return originalFunc(...args);
  }
}
mockedUrls = {};
const fetchSpy = kompotSpy('fetch');

async function mockedFetch(url, options) {

  if (mockedUrls[url]) {
    const handler = mockedUrls[url];
    fetchSpy(url, options);
    return handler(url, options);
  } else {
    return originalFetch(url, options);
  }
}

function mockFetchUrl(url, handler) {
  mockedUrls[url] = handler;
}