const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');


const KOMPOT_FILE_EXTENTION = '.kompot.spec.js';
const OUTPUT_PATH = './node_modules/kompot/generatedRequireKompotSpecs.js';
const appName = process.argv[2];

filePathList = getAllFilesWithKompotExtention();

console.log('Found kompot specs:');
console.log(filePathList.join('\n'));
console.log('\n');

const requireStatements = filePathList
  .map(filePath => {
    const fileName = path.basename(filePath, KOMPOT_FILE_EXTENTION);
    return `if(global['${fileName}']){require('${path.resolve(filePath)}');}`;
  }).join('\n');

const output = `
const AppRegistry = require('react-native').AppRegistry;
AppRegistry.registerComponent('${appName}', () => global.KompotContainer);

export default function(){
${requireStatements}
}
`
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
