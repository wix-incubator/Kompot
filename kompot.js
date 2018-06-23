
module.exports = {
  kompotRequire: function (pathToComponent) {
    const path = require('path');
    const fetch = require('node-fetch');
    const fileName = path.basename(pathToComponent, '.js');
    const requests = [];
    requests.push(fetch(`http://localhost:2600/setCurrentComponent?componentName=${fileName}`));

    const testComponentBuilder =  {
        withMocks: function(globals) {
          const query = globals.map(global => `${global}=true`).join('&');
          requests.push(fetch(`http://localhost:2600/setGlobals?${query}`));
          return this;
        },
        withProps: function(props) {
          const query = Object.keys(props)
          .map(key => {
            let value = props[key];
            if(isFunction(props[key])){
              value = 'FUNCTION#'+ value.toString();
            }
            return `${key}=${encodeURIComponent(value)}`;
          })
          .join('&');
          requests.push(fetch(`http://localhost:2600/setProps?${query}`));
          return this;
        },
        kompotInjector: function(){
          return this;
        },
        mount : async function(){
          return Promise.all(requests);
        }
      };

    const handler = {
      get: (target,prop) => {
        console.log('getting prop', prop)
        if(testComponentBuilder.hasOwnProperty(prop)){
          return testComponentBuilder[prop];
        } else{
          return testComponentBuilder;
        }
      }
    }
    return new Proxy(testComponentBuilder, handler);
  }
};

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }