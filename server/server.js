const express = require('express');
const bodyParser = require('body-parser')

const fs = require('fs');
const app = express();

let currentComponent;
let globals;
let props;
let triggers;
let spies;

function reset() {
  globals = {};
  triggers = {}
  props = '{}';
  spies = {};
}
app.use( bodyParser.json() );
app.get('/setCurrentComponent', (req, res) => {
  reset();
  currentComponent = req.query.componentName;
  console.log('Setting current component to be', currentComponent);
  res.send();
})

app.get('/getCurrentComponent', (req, res) => {
  res.send(currentComponent);
})

app.get('/setGlobals', (req, res) => {
  globals = req.query;
  console.log('Setting globals', globals);
  res.send();
})

app.get('/getGlobals', (req, res) => {
  console.log('Getting globals', globals);
  res.send(globals);
})
app.get('/setTriggers', (req, res) => {
  triggers = req.query;
  console.log('Setting triggers', triggers);
  res.send();
})

app.get('/getTriggers', (req, res) => {
  console.log('Getting triggers', triggers);
  res.send(triggers);
})


app.get('/setProps', (req, res) => {
  props = req.query.props;
  console.log('Setting props', props);
  res.send();
})

app.post('/notifySpy', (req, res) => {
  console.log('Setting spy', req.body);
  const id = req.body.id;
  if(!spies[id]) {
    spies[id] = [];
  }
  spies[id].push(req.body.stringArgs);
  res.send();
})

app.get('/getSpy', (req, res) => {
  console.log('get spy:', req.query.spyId);
  res.send(spies[req.query.spyId]);
})

app.get('/getProps', (req, res) => {
  console.log('get props:', props);
  res.send(props);
})

app.get('/', (req, res) => {
    res.send('Kompot server is running');
})

app.listen(2600, () => console.log(`Kompot server listening on port 2600`));