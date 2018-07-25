const express = require('express')
const fs = require('fs');
const app = express();

let currentComponent;
let globals;
let props;

function reset() {
  globals = {};
  triggers = {}
  props = '{}';
}

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

app.get('/getProps', (req, res) => {
  console.log('get props:', props);
  res.send(props);
})

app.get('/', (req, res) => {
    res.send('Kompot server is running');
})

app.listen(2600, () => console.log(`Kompot server listening on port 2600`));