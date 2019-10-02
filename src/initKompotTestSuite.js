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
    expect = kompotExpect;
  },
  get() {
    return expect;
  }
});

function kompotExpect(...value) {
  if (value[0] instanceof SpyRequest) {
    return spyHandlers(value[0]);
  } else {
    return originalExpect(...value);
  }
}

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
            console.log(e);
          }
        });
        if (!foundCallWithMatchedArgs) {
          throw Error(`Expected spy with id "${spy.id}" to have been called with:\n\n ${args}\n But it was called with:\n${calls}`);
        }
      } else {
          throw Error(`Expected spy with id "${spy.id}" to have been called with:\n\n ${args}\n But it was never called`);
      }
    },

    async toHaveBeenNthCalledWith(callNum, ...args) {
      const calls = await spy.calls();
      if(calls.length <= callNum) {
        throw Error(`Expected spy with id "${spy.id}" to be called ${callNum} times, but it was called only ${calls.length} times`);
      }
      if (calls) {
        let parsedCall;
        try{
          parsedCall = JSON.parse(calls[callNum]);
        } catch(e) {
          console.log(e);
        }

        if (!isEqual(parsedCall, args)) {
          throw Error(`Expected spy with id "${spy.id}" call number ${callNum} to be:\n\n ${JSON.stringify(args)}\n But it was:\n${JSON.stringify(parsedCall)}`);
        }
      }
    }
  }
}

module.exports = {
  initJest: () => {
    originalExpect = global.expect;
    global.expect = kompotExpect;
  }
}