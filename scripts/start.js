let spawn = require('child_process').spawn;
spawn('react-native', ['start', '--projectRoots',`${__dirname}/../,${__dirname}/../../../`], { stdio: 'inherit' });
