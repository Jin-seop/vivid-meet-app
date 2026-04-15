import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './RootStack';

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  navigationRef.current?.navigate(name as any, params);
}
