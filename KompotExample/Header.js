import React from 'react';
import {Text} from 'react-native';

export const Header = (props) => {
  return <Text testID="header">{`Hello ${props.name},`}</Text>
}