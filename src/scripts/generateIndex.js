const _ = require('lodash'); 
const execSync = require('child_process').execSync;
const Path = require('path');
const fs = require('fs');
const Templates = require('../rootComponentTemplates');
const ArgumentParser = require('argparse').ArgumentParser;
const babylon = require('babylon');
const traverse = require('babel-traverse').default;

const KOMPOT_FILE_EXTENTION = '.kompot.spec.js';
const OUTPUT_PATH = `${__dirname}/../generatedRequireKompotSpecs.js`;
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

parser.addArgument(['-l', '--load'], {
  help: `A path to a file that will be loaded before the mounting of the component. Put all global mocks in this file`,
  metavar: 'filePath'
});

const args = parser.parseArgs();
filePathList = getAllFilesWithKompotExtension();

console.log('Found kompot specs:');
console.log(filePathList.join('\n'));
console.log('\n');

const requireStatements = filePathList
  .map(filePath => {
    const dataFromFile = extractDataFromFile(filePath);
    const fileName = Path.basename(dataFromFile.requirePath);
    return `if(global['${fileName}']){
      await global.kompotCodeInjector();
      currentComponent = require('${dataFromFile.requirePath}')${dataFromFile.requireMember? `.${dataFromFile.requireMember}`: ''};
      if(!currentComponent) {
        throw new Error('Component is undefined: Please check your kompotRequire statement in ${filePath}');
      }
    }`;
  }).join('\n');


let registerRootComponent;
if (args.app_type === 'react-native-navigation') {
  registerRootComponent = Templates.getNavigationTemplate(args.name);
} else if (args.init) {
  registerRootComponent = `require('${Path.resolve(args.init)}');`;
} else {
  registerRootComponent = Templates.getDefaultTemplate(args.name);
}

let loadMocksFile = '';
if(args.load){
  loadMocksFile = `require('${Path.resolve(args.load)}');`
}
const requireStatementsFunction = `
export default async function(){
  let currentComponent;
  ${requireStatements}
  global.KompotApp(currentComponent);
}`;
output = [loadMocksFile, registerRootComponent, requireStatementsFunction].join('\n');

fs.writeFile(OUTPUT_PATH, output, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log(`Successfuly created: ${OUTPUT_PATH}`);
});

function extractDataFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ast = babylon.parse(content, {sourceType: 'module'});
  let kompotRequireAbsolutePath;
  let kompotRequireMember;
  traverse(ast, {
    CallExpression: ({node}) => {
      const methodName = _.get(node, 'callee.property.name');
      const calleeName = _.get(node, 'callee.name');
      if(methodName === 'kompotRequire') {
        const kompotRequireRelativePath = node.arguments[0].extra.rawValue;
        kompotRequireAbsolutePath = Path.resolve(Path.dirname(filePath),kompotRequireRelativePath);
      }
    },
    MemberExpression: ({node}) => {
      const methodName = _.get(node, 'object.callee.property.name');
      if(methodName === 'kompotRequire') {
        kompotRequireMember = node.property.name;
      }
    }
  });

  if(kompotRequireAbsolutePath){
    console.log('Found kompot require statement:', kompotRequireAbsolutePath, ' in file: ', filePath);
    return {requirePath: kompotRequireAbsolutePath, requireMember: kompotRequireMember};
  } else {
    throw new Error('Cannot find kompot require statement')
  }
}

function getAllFilesWithKompotExtension() {
  const allFilesWithKompotExtention = execSync(`find . -not \\( -path ./node_modules -prune \\)  -not \\( -path ./.idea -prune \\)  -type f  -name '*.kompot.*.js' -or -name '*.kompot.*.ts`).toString();
  const filePathList = allFilesWithKompotExtention.split('\n').filter(path => path !== '');
  return filePathList;
}
