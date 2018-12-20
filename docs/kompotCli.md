# Kompot CLI

```
usage: kompot [-h] [-s] [-k] [-r] [-b appName]
                     [-t {react-native-navigation}] [-i filePath]
                     [-l filePath]


Optional arguments:
  -h, --help            Show this help message and exit.
  -s, --start           Launch react-native's packager.
  -k, --kill            Kill server and packager if needed.
  -r, --run-server      Start the Kompot server on port 2600
  -b appName, --build appName
                        Scan the project for *.kompot.spec.js and process
                        them. app name should be the same name that you pass
                        to AppRegistry.registerComponent()
  -t {react-native-navigation}, --app-type {react-native-navigation}
                        Application type.
  -i filePath, --init-root filePath
                        A path to an initialization file, for custom
                        initializaion of the root component.
  -l filePath, --load filePath
                        A path to a file that will be loaded before the
                        mounting of the component. Put all global mocks in
                        this file
```

