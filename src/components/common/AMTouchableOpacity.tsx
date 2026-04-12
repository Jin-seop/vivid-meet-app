import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';

interface AMTouchableOpacityProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  throttleTime?: number;
}

const AMTouchableOpacity = (props: AMTouchableOpacityProps) => {
  const { onPress, throttleTime = 1000, children, ...rest } = props;
  const lastPress = useRef<number>(0);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      const now = Date.now();
      if (onPress && now - lastPress.current > throttleTime) {
        lastPress.current = now;
        onPress(event);
      }
    },
    [onPress, throttleTime],
  );

  return (
    <TouchableOpacity {...rest} onPress={onPress ? handlePress : undefined}>
      {children}
    </TouchableOpacity>
  );
};

export default AMTouchableOpacity;
