import { AppRegistry} from 'react-native';
import {Container} from './Container';
import React from 'react';
import './fakeMochaGlobals';
import ReactNative from 'react-native';

AppRegistry.registerComponent('Kompot', () => Container);

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

fetchAndSetGlobals();
fetchAndSetProps();
fetchAndEvaluateBundle();


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

async function fetchAndEvaluateBundle() {
  try {
    const response = await fetch('http://localhost:2600', { method: 'GET', headers: { "Content-Type": "text/plain"} });
    const content = await response.text();
    eval(content);
  } catch (e) {
    console.error('Cannot fetch bundle: ',e.message);
  }
}