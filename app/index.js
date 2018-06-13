import { AppRegistry} from 'react-native';
import {Container} from './Container';
AppRegistry.registerComponent('Kompot', () => Container);

let onComponentToTestReadyListener;
global.onComponentToTestReady = function(listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function(ComponentToTest){
  onComponentToTestReadyListener(ComponentToTest);
}

global.Kompot = global.setComponentToTest;
//mock all mocha's globals:
global.describe = () => {}

fetchAndEvaluateBundle();
async function fetchAndEvaluateBundle() {
  try {
    const response = await fetch('http://localhost:1234/main.bundle.js', { method: 'GET', headers: { "Content-Type": "text/plain"} });
    const content = await response.text();
    eval(content);
  } catch (e) {
    console.error('Cannot fetch bundle: ',e.message);
  }
}