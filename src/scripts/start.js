let spawn = require('child_process').spawn;
spawn('./node_modules/.bin/react-native', ['start', '--projectRoot',`${__dirname}/../`, '--watchFolders', `${__dirname}/../../../../`], { stdio: 'inherit' });
