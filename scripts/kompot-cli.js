const ArgumentParser = require('argparse').ArgumentParser;
let exec = require('child_process').exec;

const parser = new ArgumentParser();

parser.addArgument(['-s', '--start'], {
  help: `Start the Kompot server on port 2600`,
  action: 'storeTrue'
});

parser.addArgument(['-b', '--bundle'], {
  help: `Scan the project for *.kompot.spec.js and generate the bundles.`,
  action: 'storeTrue'
});

const args = parser.parseArgs();
if(args.bundle){
  exec('node ./node_modules/kompot/scripts/generateBundles.js', (err,stdout) => console.log(err,stdout));
}
if(args.start){
  exec(`node ./node_modules/kompot/server/server.js`, (err,stdout) => console.log(err,stdout));
}