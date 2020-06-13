const {init, setTestIdForSpies, expect} = require('./initKompotTestSuite');
const testKey = Math.floor(Math.random() * 1000000).toString();
let isTestKeyAlreadyInjectedToClient = false;
setTestIdForSpies(testKey);
module.exports = {
  init,
  kompotRequire: function (pathToComponent) {
    const fetch = require('node-fetch');
    const path = require('path');
    const fileName = path.basename(pathToComponent, '.js');
    const {serialize} = require('./Serialize');
    let globals = [];
    let triggers = [];
    let props = {};

    const testComponentBuilder = {
      withMocks: function (globalsToAdd) {
        globals = globals.concat(globalsToAdd);
        return this;
      },
      withTriggers: function (triggersToAdd) {
        triggers = triggers.concat(triggersToAdd);
        return this;
      },
      withProps: function (propsToAdd) {
        Object.assign(props, propsToAdd);
        return this;
      },
      mount: async function () {
        const body = {
          testKey,
          componentName: fileName,
          globals: globals.map((mock) => mock.name),
          triggers,
          props: serialize(props)
        }

        await fetch(`http://localhost:2600/setComponentToTest`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        });

        await device.reloadReactNative();
        if(!isTestKeyAlreadyInjectedToClient) {
          isTestKeyAlreadyInjectedToClient = true;
          await element(by.id("testKeyInput")).replaceText(testKey);
          await element(by.id("submitTestKey")).tap();
        }
        globals = [];
        props = {};
      },
      expect
    };

    const handler = {
      get: (target, prop) => {
        if (testComponentBuilder.hasOwnProperty(prop)) {
          return testComponentBuilder[prop];
        } else {
          return testComponentBuilder;
        }
      }
    }
    return new Proxy(testComponentBuilder, handler);
  }
};
