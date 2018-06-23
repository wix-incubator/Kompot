module.exports = {
  serialize: (obj) => {
    function functionReplacer(key, value) {
      if (typeof (value) === 'function') {
        return '##FUNCTION##' + value.toString();
      }
      return value;
    }

    return JSON.stringify(obj, functionReplacer);
  },
  deSerialize: (str) => {
    function functionReviver(key, value) {
      if (typeof value === 'string' && value.startsWith('##FUNCTION##')) {
        value = value.replace('##FUNCTION##', '');
        value = new Function('return ' + value)();
      }
      return value;
    }
    return JSON.parse(str, functionReviver);
  }
}

