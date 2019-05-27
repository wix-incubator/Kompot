#!/usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const Path = require('path');
let spawn = require('child_process').spawn;
let execSync = require('child_process').execSync;

const parser = new ArgumentParser();
parser.addArgument('command', {
  nargs: '*',
  //todo: uncomment after deprecation of -srk:
  //choices: ['start', 'build'] 
});

parser.addArgument(['-e', '--entry-point'], {
  help: `The path to the entry-point. Defaults to index.js`,
});

parser.addArgument(['-s', '--start'], {
  help: `Launch react-native's packager.`,
  action: 'storeTrue',
});

parser.addArgument(['-k', '--kill'], {
  help: `Kill server and packager if needed.`,
  action: 'storeTrue'
});

parser.addArgument(['-r', '--run-server'], {
  help: `Start the Kompot server on port 2600`,
  action: 'storeTrue'
});

parser.addArgument(['-n', '--name'], {
  help: `App name`,
  metavar: 'appName'
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
  help: `A path to an initialization file, for custom initialization of the root component.`,
  metavar: 'filePath'
});

parser.addArgument(['-l', '--load'], {
  help: `A path to a file that will be loaded before the mounting of the component. Put all global mocks in this file`,
  metavar: 'filePath',
  defaultValue: 'kompot-setup.js'
});

const COMMANDS = {START: 'start', BUILD: 'build'};
const args = parser.parseArgs();
const command = args.command[0];
if (args.app_type && args.init_root) {
  throw new Error(`Cannot use '--init-root' option along with '--app-type'.`)
}

if(args.entry_point) {
  const fileName = Path.basename(args.entry_point);
  const dirName = Path.dirname(args.entry_point);
  const kompotIndex = Path.resolve(`${__dirname}/../index.js`);
  execSync(`mkdir -p ${__dirname}/../../${dirName}`, (e, stdout, stderr) => {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
  });
    fs.writeFile(`${__dirname}/../../${dirName}/${fileName}`, `require('${kompotIndex}');`, function(err) {
      if(err) {
          return console.log(err);
      }
  });
}

const build = command === COMMANDS.BUILD;
if (args.build || build) {
  const command = [`${__dirname}/generateIndex.js`, '-n', args.build || args.name];
  if (args.app_type) {
    command.push('-t');
    command.push(args.app_type);
  }
  if (args.init_root) {
    command.push('-i');
    command.push(args.init_root);
  }

  if (args.load && fs.existsSync(Path.resolve(args.load))) {
    command.push('-l');
    command.push(args.load);
  }

  spawn('node', command, { stdio: 'inherit' });
}

const start = command === COMMANDS.START;

//todo: remove separate command and use only start:
if (args.kill || start) {
  execSync(`lsof -i:8081 | awk 'NR!=1 {print $2}' | xargs kill && lsof -i:2600 | awk 'NR!=1 {print $2}' | xargs kill`, (e, stdout, stderr) => {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
  });
}

if (args.start || start) {
  spawn('node', [`${__dirname}/start.js`], { stdio: 'inherit' });
}

if (args.run_server || start) {
  spawn('node', [`${__dirname}/../server/server.js`], { stdio: 'inherit' });
}