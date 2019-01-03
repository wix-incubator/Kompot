import React from 'react';
import { Text } from 'react-native';
import * as HeaderModule from './Header'
const mockedHeader = (props) => {
  return <Text testID="mockedHeader">{`Mocked Header with prop: ${props.name}`}</Text>;
}

HeaderModule.Header = mockedHeader;

global.kompot.useMocks(() => require('./KompotTests/mocks'));
