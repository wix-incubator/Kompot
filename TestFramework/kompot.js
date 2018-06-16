module.exports = {
  require: function (getComponent, mocks={}) {
    if (global.KompotApp) {
      Object.keys(mocks).forEach(key => {
        if(global[key]) {
          mocks[key]();
        }
      });
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
      withProps: function(props) {
        const query = props.map(key => `${key}=${props[key]}`).join('&');
        requests.push(fetch(`http://localhost:1234/setProps?${query}`));
        return this;
      },
      mount : async function(){
        return Promise.all(requests);
      }
    };
  }
};