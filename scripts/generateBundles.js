let execSync = require('child_process').execSync;
let process = require('process');
process.chdir('../../../');

let path = require('path');
const allFilesWithKompotExtention = execSync(`find . -not \\( -path ./node_modules -prune \\) -type f  -name '*.kompot.*.js'`).toString();
const filePathList = allFilesWithKompotExtention.split('\n');
filePathList.forEach(filePath => {
  const fileName = path.basename(filePath,'.kompot.spec.js');
  const dirName = path.dirname(filePath);
  if(fileName){
  console.log('name: ',fileName, dirName);
  }
});
console.log(filePathList);