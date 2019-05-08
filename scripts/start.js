let spawn = require('child_process').spawn;
spawn('./node_modules/.bin/react-native', ['start', '--config', './node_modules/kompot/metro.config.js'], { stdio: 'inherit' });
