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
  help: `Scan the project for *.kompot.spec.js and process them. You should supply this command with your app's name (the same name to you pass to AppRegistry.registerComponent())`
});

const args = parser.parseArgs();
if(args.build){
  spawn('node', [`./node_modules/kompot/scripts/generateIndex.js`, args.bundle], { stdio: 'inherit' });
}
if(args.start){
  spawn('node', [`./node_modules/kompot/scripts/start.js`], { stdio: 'inherit' });
}

if(args.run_server){
  spawn('node', [`./node_modules/kompot/server/server.js`], { stdio: 'inherit' });
}