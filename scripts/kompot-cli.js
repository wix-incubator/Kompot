#!/usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
let spawn = require('child_process').spawn;

const parser = new ArgumentParser();

parser.addArgument(['-s', '--start'], {
  help: `Launch react-native's packager.`,
  action: 'storeTrue'
});

parser.addArgument(['-r', '--run-server'], {
  help: `Start the Kompot server on port 2600`,
  action: 'storeTrue'
});

parser.addArgument(['-b', '--build'], {
  help: `Scan the project for *.kompot.spec.js and process them. app name should be the same name that you pass to AppRegistry.registerComponent()`,
  metavar: 'appName'
});

parser.addArgument(['-t', '--app-type'], {
  help: `Application type.`,
  choices: ['react-native-navigation']
});

parser.addArgument(['-i', '--init-root'], {
  help: `A path to an initialization file, for custom initializaion of the root component.`,
  metavar: 'filePath'
});

parser.addArgument(['-l', '--load'], {
  help: `A path to a file that will be loaded before the mounting of the component. Put all global mocks in this file`,
  metavar: 'filePath'
});


const args = parser.parseArgs();
if(args.app_type && args.init_root){
  throw new Error(`Cannot use '--init-root' option along with '--app-type'.`)
}
if(args.build){
  const command = [`./node_modules/kompot/scripts/generateIndex.js`, '-n',args.build];
  if(args.app_type){
    command.push('-t');
    command.push(args.app_type);
  }
  if(args.init_root){
    command.push('-i');
    command.push(args.init_root);
  }

  if(args.load){
    command.push('-l');
    command.push(args.load);
  }

  spawn('node', command, { stdio: 'inherit' });
}
if(args.start){
  spawn('node', [`./node_modules/kompot/scripts/start.js`], { stdio: 'inherit' });
}

if(args.run_server){
  spawn('node', [`./node_modules/kompot/server/server.js`], { stdio: 'inherit' });
}