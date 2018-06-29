import ReactNative, { AppRegistry, StyleSheet, View } from 'react-native';

const Root = () => {
  return (
    <View testID="customRoot" style={[StyleSheet.absoluteFillObject,{backgroundColor: 'red'}]}><global.KompotContainer/></View>
  );
}
AppRegistry.registerComponent('KompotExample', () => Root);
