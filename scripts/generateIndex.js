const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const Templates = require('../rootComponentTemplates');
const ArgumentParser = require('argparse').ArgumentParser;
const babylon = require('babylon');
const traverse = require('babel-traverse').default;

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
    const kompotRequire = readFileAndExtractKompotRquirePath(filePath);
    const fileName = path.basename(filePath, KOMPOT_FILE_EXTENTION);
    return `if(global['${fileName}']){require('${kompotRequire}');}`;
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

function readFileAndExtractKompotRquirePath(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ast = babylon.parse(content, {sourceType: 'module'});
  let kompotRequireAbsolutePath;
  traverse(ast, {
    CallExpression: ({node}) => {
      if(node.callee.object && node.callee.object.name === 'Kompot' && node.callee.property.name === 'require') {
        const kompotRequireRelativePath = node.arguments[0].extra.rawValue;
        kompotRequireAbsolutePath = path.resolve(filePath,kompotRequireRelativePath);
      }
    }
  });
  if(kompotRequireAbsolutePath){
    console.log('Found kompot require statement:', kompotRequireAbsolutePath, ' in file: ', filePath);
    return kompotRequireAbsolutePath;
  } else {
    throw new Error('Cannot find kompot require statement')
  }
}

function getAllFilesWithKompotExtention() {
  const allFilesWithKompotExtention = execSync(`find . -not \\( -path ./node_modules -prune \\)  -not \\( -path ./.idea -prune \\)  -type f  -name '*.kompot.*.js'`).toString();
  const filePathList = allFilesWithKompotExtention.split('\n').filter(path => path !== '');
  return filePathList;
}
