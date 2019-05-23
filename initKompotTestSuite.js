const fetch = require('node-fetch');
const {isObject, isEqual} = require('lodash');

async function fetchSpyCalls(id) {
  const response = await fetch(`http://localhost:2600/getSpy?spyId=${id}`);
  const text = await response.text();
  if (text) {
    return JSON.parse(text);
  }
}

class SpyRequest {
  constructor(id) {
    this.id = id;
  }
  async calls() {
    return await fetchSpyCalls(this.id);
  }
}

global.spy = (id) => {
  return new SpyRequest(id);
};


let expect;
let originalExpect;

//swizzle expect:
Object.defineProperty(global, 'expect', {
  set(value) {
    originalExpect = value;
    expect = (...value) => {
      if (value[0] instanceof SpyRequest) {
        return spyHandlers(value[0]);
      } else {
        return originalExpect(...value);
      }
    }
  },
  get() {
    return expect;
  }
});


function spyHandlers(spy) {
  return {
    async toHaveBeenCalled() {
      const calls = await spy.calls();
      if (calls === undefined) {
        throw Error(`Expected spy with id "${spy.id}" to have been called, but it was not called`);
      }
    },
    async notToHaveBeenCalled() {
      const calls = await spy.calls();
      if (calls !== undefined) {
        throw Error(`Expected spy with id "${spy.id}" not to have been called, but it was called`);
      }
    },
    async toHaveBeenCalledWith(...args) {
      const calls = await spy.calls();
      let foundCallWithMatchedArgs;
      if (calls) {
        calls.forEach((call, index) => {
          try {
            const parsedCall = JSON.parse(call);
            if (isEqual(parsedCall, args)) {
              foundCallWithMatchedArgs = true;
            }
          } catch (e) {
          }
        });
        if (!foundCallWithMatchedArgs) {
          throw Error(`Expected spy with id "${spy.id}" to have been called with:\n\n ${args}\n But it was called with:\n${calls}`);
        }
      }
    },

    async toHaveBeenNthCalledWith(callNum, ...args) {
      const calls = await spy.calls();
      if(calls.length <= callNum) {
        throw Error(`Expected spy with id "${spy.id}" to be called ${callNum} times, but it was called only ${calls.length} times`);
      }
      if (calls) {
        try{
          const parsedCall = JSON.parse(calls[callNum]);
          if (!isEqual(parsedCall, args)) {
            throw Error(`Expected spy with id "${spy.id}" call number ${callNum} to be:\n\n ${args}\n But it was:\n${parsedCall}`);
          }
        } catch(e) {
          
        }
      }
    }
  }
}
