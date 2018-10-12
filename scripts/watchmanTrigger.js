#!/usr/bin/env node

//Watchman triggers cannot run inline command, they can only run script files. As a workaround, this script will just run the commands it gets

let execSync = require('child_process').execSync;
execSync(process.argv[2]);
