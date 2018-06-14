import {StyleSheet} from 'react-native';
StyleSheet.create = (obj) => obj;

export function Kompot(componentToTest) {
  if(global.Kompot){
    global.Kompot(componentToTest)
  }
}