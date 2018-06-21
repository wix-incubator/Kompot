const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const Templates = require('../rootComponentTemplates');
const ArgumentParser = require('argparse').ArgumentParser;

const KOMPOT_FILE_EXTENTION = '.kompot.spec.js';
const OUTPUT_PATH = './node_modules/kompot/generatedRequireKompotSpecs.js';

const parser = new ArgumentParser();

parser.addArgument(['-n', '--name'], {
  help: `App name`
});

parser.addArgument(['-i', '--init'], {
  help: `Path to initialization file`
});

parser.addArgument(['-t', '--app-type'], {
  help: `Application type.`,
  choices: ['react-native-navigation']
});

const args = parser.parseArgs();

filePathList = getAllFilesWithKompotExtention();

console.log('Found kompot specs:');
console.log(filePathList.join('\n'));
console.log('\n');

const requireStatements = filePathList
  .map(filePath => {
    const fileName = path.basename(filePath, KOMPOT_FILE_EXTENTION);
    return `if(global['${fileName}']){require('${path.resolve(filePath)}');}`;
  }).join('\n');


let registerRootComponent;
if (args.app_type === 'react-native-navigation') {
  registerRootComponent = Templates.getNavigationTemplate(args.name);
} else if (args.init) {
  registerRootComponent = `require('${args.init}');`;
} else {
  registerRootComponent = Templates.getDefaultTemplate(args.name);
}
const requireStatementsFunction = `
export default function(){
  ${requireStatements}
}`;
output = [registerRootComponent, requireStatementsFunction].join('\n');

fs.writeFile(OUTPUT_PATH, output, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log(`Successfuly created: ${OUTPUT_PATH}`);
});



function getAllFilesWithKompotExtention() {
  const allFilesWithKompotExtention = execSync(`find . -not \\( -path ./node_modules -prune \\)  -not \\( -path ./.idea -prune \\)  -type f  -name '*.kompot.*.js'`).toString();
  const filePathList = allFilesWithKompotExtention.split('\n').filter(path => path !== '');
  return filePathList;
}