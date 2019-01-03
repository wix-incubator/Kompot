let spawn = require('child_process').spawn;
spawn('react-native', ['start', '--projectRoot',`${__dirname}/../`], { stdio: 'inherit' });
