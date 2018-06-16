const ArgumentParser = require('argparse').ArgumentParser;
let exec = require('child_process').exec;
let process = require('process');

const parser = new ArgumentParser();

parser.addArgument(['-s', '--start'], {
  help: `Start the Kompot server. The default port is 8082. You can specify a different port with "-p"`,
  action: 'storeTrue'
});

parser.addArgument(['-b', '--bundle'], {
  help: `Scan the project for *.kompot.spec.js and generate the bundles.`,
  action: 'storeTrue'
});

const args = parser.parseArgs();

if(args.bundle){
  exec('node .node_modules/kompot/scripts/generateBundles.js', (err,stdout) => console.log(err,stdout));
}
if(args.start){
  exec('node .node_modules/kompot/server/server.js', (err,stdout) => console.log(err,stdout));
}