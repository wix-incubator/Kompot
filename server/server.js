const express = require('express')
const fs = require('fs');
const app = express();

let currentComponent;
let globals = {};
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
  globals = {};
})

app.get('/', (req, res) => {
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

app.listen(1234, () => console.log('Kompot server listening on port 1234!'))