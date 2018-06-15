import { AppRegistry} from 'react-native';
import {Container} from './Container';
import React from 'react';
import './fakeMochaGlobals';
import ReactNative from 'react-native';


async function fetchGlobals(){
  try {
    const response = await fetch('http://localhost:1234/getGlobals', { method: 'GET', headers: { "Content-Type": "application/json"} });
    const globals = await response.json();
    Object.keys(globals).forEach(key => global[key] = true);
  } catch (e) {
    console.error('Cannot fetch bundle: ',e.message);
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
AppRegistry.registerComponent('Kompot', () => Container);

let onComponentToTestReadyListener;
global.onComponentToTestReady = function(listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function(ComponentToTest){
  onComponentToTestReadyListener(ComponentToTest);
}

global.Kompot = global.setComponentToTest;
global.React = React;
global.ReactNative = ReactNative;

fetchGlobals();
fetchAndEvaluateBundle();
