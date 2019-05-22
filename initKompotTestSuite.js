const fetch = require('node-fetch');

async function checkSpy(id) {
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
  async value() {
    return await checkSpy(this.id);
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
        return spyHandlers(spy);
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
      const spyValue = await spy.value();
      if (spyValue === undefined) {
        throw Error(`Expected spy with id "${spy.id}" to have been called, but it was not called`);
      }
    },
    async toHaveBeenCalledWith() {
      const spyValue = await spy.value();
    }
  }
}
