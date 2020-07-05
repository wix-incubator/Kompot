import ReactNative, {ActivityIndicator, View, Dimensions, SafeAreaView, TouchableWithoutFeedback, TextInput} from 'react-native';
import React from 'react';
import {deSerialize} from './Serialize';
import hoistNonReactStatics from 'hoist-non-react-statics';
import AsyncStorage from '@react-native-community/async-storage';
import UrlPattern from 'url-pattern';

const TEST_KEY_STORAGE = 'TEST_KEY_STORAGE';
const originalFetch = fetch;
const providers = [];
const mockedUrlsPatterns = [];
let globalFetchHandler;
let testKey;
const renderTriggers = (triggers) => {
  const onTriggerPressed = (trigger) => global.triggers[trigger] && global.triggers[trigger]();
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
    <View style={{flexGrow: 1}}>
      {renderTriggers(triggers)}
      <Component ref={(ref) => global.savedComponentRef = ref} {...props} />
    </View>);
  providers.forEach(provider => {
    TestedComponent = <SafeAreaView><provider.component {...provider.props}>{TestedComponent}</provider.component></SafeAreaView>;
  });
  return TestedComponent;
}

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      TestedComponent: undefined,
      testKey: ''
    }
  }
  componentDidMount() {
    AsyncStorage.getItem(TEST_KEY_STORAGE).then(storedKey => {
      if (storedKey) {
        testKey = storedKey;
        run();
      }
    });

    global.onComponentToTestReady((TestedComponent, props, triggers) => {
      if (global.isReactNativeNavigationProject) {
        const Wrapper = (wrapperProps) => {
          return getWrappedComponent(TestedComponent, {...wrapperProps, ...props}, triggers);
        }
        hoistNonReactStatics(Wrapper, TestedComponent);
        global.registerComponentAsRoot('kompotComponent', Wrapper, {...props});
      } else {
        this.setState({TestedComponent: getWrappedComponent(TestedComponent, props, triggers)});
      }
    });
  }

  onReceiveTestKey = () => {
    testKey = this.state.testKey;
    AsyncStorage.setItem(TEST_KEY_STORAGE, testKey);
    run();
  }
  renderLoader() {
    return (
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 10,
        flex: 1,
        justifyContent: 'center'
      }}>
        <TextInput style={{fontSize: 1}} testID="testKeyInput" onChangeText={(text) => this.setState({testKey: text})} value={this.state.testKey} />
        <TouchableWithoutFeedback testID="submitTestKey" onPress={this.onReceiveTestKey}>
          <ActivityIndicator size="large" color="black" />
        </TouchableWithoutFeedback>
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
async function run() {
  try {
    const response = await originalFetch(`http://localhost:2600/getComponentToTest?testKey=${testKey}`, {method: 'GET', headers: {"Content-Type": "application/json"}});
    const info = await response.json();
    global[info.componentName] = true;
    global.componentProps = deSerialize(info.props);
    info.globals.forEach(key => global[key] = true);
    info.triggers.forEach(key => global.triggers[key] = true);
    requireComponentSpecFile();
  } catch (e) {
    console.error('Fail to run kompot: ', e);
  }
}


async function notifySpyTriggered(body) {
  if(testKey) {
    try {
      await originalFetch(`http://localhost:2600/${testKey}/notifySpy`, {method: 'POST', body, headers: {"Content-Type": "application/json"}});
    } catch (e) {
      console.log('Cannot set spy: ', e.message);
    }
  }
}

async function kompotCodeInjector() {
  try {
    const mocks = requireGlobalMocks.map(getMocks => getMocks());
    const injectorObject = Object.assign({}, ...mocks);
    injectorObject.default && injectorObject.default();
    for (let key in injectorObject) {
      if (key !== 'default' && global[key]) {
        await injectorObject[key]();
      }
      if (global.triggers[key]) {
        global.triggers[key] = injectorObject[key];
      }
    }
  } catch (e) {
    console.error('Failed to apply mocks:', e);
  }
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
const fetchSpy = kompotSpy('fetch');

async function mockedFetch(url, options) {
  const matchedMock = mockedUrlsPatterns.find((mock) => {
    const [basePart, query] = url.split('?');
    return mock.pattern.match(basePart) !== null;
  });
  if (matchedMock) {
    fetchSpy(url, options);
    return matchedMock.handler(url, options);
  }
  if (globalFetchHandler) {
    fetchSpy(url, options);
    return globalFetchHandler(url, options)
  }
  return originalFetch(url, options);
}

function mockFetchUrl(url, handler) {
  const escapedUrl = url.replace('https://', 'https\\://').replace('http://', 'http\\://');
  if (url === '*') {
    globalFetchHandler = handler;
  } else {
    mockedUrlsPatterns.push({pattern: new UrlPattern(escapedUrl), handler});
  }
}