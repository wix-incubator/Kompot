const express = require('express')
const fs = require('fs');
const app = express();
const ArgumentParser = require('argparse').ArgumentParser;
parser.addArgument(['-p', '--port'], {
  help: `Specify server port`,
  type: 'int',
  action: 'storeConst'
});
const args = parser.parseArgs();

let currentComponent;
let globals = {};
let props = {};
let serverMode='FORGET';

app.get('/setServerMode', (req, res) => {
  serverMode = req.query.mode;
  console.log('Setting server mode to be', serverMode);
  res.send();
})

app.get('/setCurrentComponent', (req, res) => {
  currentComponent = req.query.componentName;
  console.log('Setting current component to be', currentComponent);
  res.send();
})

app.get('/setGlobals', (req, res) => {
  globals = req.query;
  console.log('Setting globals', globals);
  res.send();
})

app.get('/getGlobals', (req, res) => {
  res.send(globals);
  if(serverMode === 'FORGET'){
    globals = {};
  }
})

app.get('/setProps', (req, res) => {
  props = req.query;
  console.log('Setting props', props);
  res.send();
})

app.get('/getProps', (req, res) => {
  res.send(props);
  if(serverMode === 'FORGET'){
    props = {};
  }
})

app.get('/', (req, res) => {
  if(!currentComponent){
    res.send();
  }
  const path =  `${ __dirname}/../.generatedBundles/`;
  const fileName = `${currentComponent}.bundle.js`;
  options ={
    root: path
  }
  console.log('Sending: ', path+fileName);
  res.sendFile(fileName,options, (err) => {
    if(err) {
      console.log('ERROR:', err);
    }
  });
})

app.listen(args.port, () => console.log(`Kompot server listening on port ${args.port}`))