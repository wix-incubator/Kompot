module.exports = {
  mockJokeService: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('A mocked joke fetched from the joke service!');
    }
  },
  mockClassProp: () => {
    class Joke {
      getJoke(){
        return 'a foo walks into a bar';
      }
    }
    global.componentProps.jokeClass = new Joke();
  },
  mockLameJoke: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('This is a lame Chuck Norris joke')
    }
  },
  spyDoSomething: () => {
    const DoSomethingModule = require('../doSomething');
    DoSomethingModule.doSomething = kompot.spy('doSomething');
  },
  triggerNavigationEvent:() => {
    global.savedComponentRef.onNavigationEvent('some event!');
  }
}