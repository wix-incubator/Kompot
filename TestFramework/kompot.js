module.exports = {
  Kompot: function Kompot(getComponent) {
    if (global.Kompot) {
      const StyleSheet = require('react-native').StyleSheet;
      StyleSheet.create = (obj) => obj;
      global.Kompot(getComponent())
    }
  }
};