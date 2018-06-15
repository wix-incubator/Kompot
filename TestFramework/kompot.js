module.exports = {
  Kompot: function Kompot(getComponent) {
    if (global.Kompot) {
      const StyleSheet = require('react-native').StyleSheet;
      StyleSheet.create = (obj) => obj;
      global.Kompot(getComponent())
    }
  },
  inject: function(conditionalCode){
    if (global.Kompot) {
      Object.keys(conditionalCode).forEach(key => {
        if(global[key]) {
          conditionalCode[key]();
        }
      });
    }
  },
  with: async function(globals) {
    const query = globals.join('=true&');
    const fetch = require('node-fetch');
    fetch(`http://localhost:1234/setGlobals?${query}`);
  },
  initComponent: async function(name) {
    const fetch = require('node-fetch');
    fetch(`http://localhost:1234/setCurrentComponent?componentName=${name}`);
  }
};