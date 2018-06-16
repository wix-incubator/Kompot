import { AppRegistry} from 'react-native';
import {Container} from './Container';
import React from 'react';
import './fakeMochaGlobals';
import ReactNative from 'react-native';

AppRegistry.registerComponent('Kompot', () => Container);

let onComponentToTestReadyListener;
let props;
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
fetchAndEvaluateBundle();


async function fetchAndSetGlobals(){
  try {
    const response = await fetch('http://localhost:1234/getGlobals', { method: 'GET', headers: { "Content-Type": "application/json"} });
    const globals = await response.json();
    Object.keys(globals).forEach(key => global[key] = true);
  } catch (e) {
    console.error('Cannot fetch globals: ',e.message);
  }
}

async function fetchAndSetProps(){
  try {
    const response = await fetch('http://localhost:1234/getProps', { method: 'GET', headers: { "Content-Type": "application/json"} });
    props = await response.json();
  } catch (e) {
    console.error('Cannot fetch props: ',e.message);
  }
}

async function fetchAndEvaluateBundle() {
  try {
    const response = await fetch('http://localhost:1234', { method: 'GET', headers: { "Content-Type": "text/plain"} });
    const content = await response.text();
    eval(content);
  } catch (e) {
    console.error('Cannot fetch bundle: ',e.message);
  }
}