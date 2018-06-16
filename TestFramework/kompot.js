module.exports = {
  require: function (getComponent, mocks={}) {
    if (global.KompotApp) {
      Object.keys(mocks).forEach(key => {
        if(global[key]) {
          mocks[key]();
        }
      });
      const StyleSheet = require('react-native').StyleSheet;
      StyleSheet.create = (obj) => obj;
      global.KompotApp(getComponent())
    }
  },
 
  testComponent: function(name) {
    const fetch = require('node-fetch');
    const requests = [];
    requests.push(fetch(`http://localhost:1234/setCurrentComponent?componentName=${name}`));

    return {
      withMocks: function(globals) {
        const query = globals.map(global => `${global}=true`).join('&');
        requests.push(fetch(`http://localhost:1234/setGlobals?${query}`));
        return this;
      },
      mount : async function(){
        return Promise.all(requests);
      }
    };
  }
};