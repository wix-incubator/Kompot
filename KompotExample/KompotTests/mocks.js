module.exports = {
  mockJokeService: () => {
    const JokeService = require('../fetchJokeService');
    JokeService.fetchJoke = async () => {
      return Promise.resolve('A mocked joke fetched from the joke service!');
    }
  },
  mockFetchUrl: () => {
    global.kompot.mockFetchUrl('https://api.chucknorris.io/jokes/random', () => {
      return new global.Response(JSON.stringify({value: 'success mocking url!'}));
    });
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
  spyOnLameJoke: () => {
    const JokeService = require('../fetchJokeService');
    global.kompot.spyOn(JokeService, 'fetchJoke', 'JokeService.fetchJoke');
  },
  spyDoSomething: () => {
    const DoSomethingModule = require('../doSomething');
    DoSomethingModule.doSomething = kompot.spy('doSomething');
  },
  triggerNavigationEvent:() => {
    global.savedComponentRef.onNavigationEvent('some event!');
  }
}