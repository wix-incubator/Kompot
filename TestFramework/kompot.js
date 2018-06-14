module.exports = {
  Kompot: function Kompot(getComponent) {
    if (global.Kompot) {
      const StyleSheet = require('react-native').StyleSheet;
      StyleSheet.create = (obj) => obj;
      global.Kompot(getComponent())
    }
  },
  initComponent: async function(name) {
    const fetch = require('node-fetch');
    fetch(`http://localhost:1234/setCurrentComponent?componentName=${name}`);
  }
};