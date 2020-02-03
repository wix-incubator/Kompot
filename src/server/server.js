const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser();
parser.addArgument(['-s', '--silent'], {
  help: `Suppress logs.`,
  action: 'storeTrue',
});
const args = parser.parseArgs();

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const data = {};
const spies = {}

app.use( bodyParser.json() );
app.post('/setComponentToTest', (req, res) => {
  log('setting component',req.body);
  data[req.body.testKey] = {
    componentName: req.body.componentName,
    globals: req.body.globals,
    triggers: req.body.triggers,
    props: req.body.props,
  }
  spies[req.body.testKey] = {};
  res.send();
})

app.get('/getComponentToTest', (req, res) => {
  log('getComponentToTest: ', data[req.query.testKey]);
  res.send(data[req.query.testKey]);
})


app.post('/:testKey/notifySpy', (req, res) => {
  const spyId = req.body.id;
  log('Setting spy', req.params.testKey, req.body);
  if(!spies[req.params.testKey][spyId]) {
    spies[req.params.testKey][spyId] = [];
  }
  spies[req.params.testKey][spyId].push(req.body.stringArgs);
  res.send();
})

app.get('/:testKey/getSpy', (req, res) => {
  log('get spy:',req.params.testKey, req.query.spyId, spies[req.params.testKey][req.query.spyId]);
  res.send(spies[req.params.testKey][req.query.spyId]);
})

app.get('/', (req, res) => {
    res.send('Kompot server is running');
})

app.listen(2600, () => console.log(`Kompot server listening on port 2600`));

function log(...params){
  if(!args.silent) {
    console.log(...params);
  }
}