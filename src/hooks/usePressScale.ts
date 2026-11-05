import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { PRESS_SPRING } from '../constants/config';

/**
 * Press feedback pair (rule #8): the <Pressable> stays the PARENT and drives
 * an <Animated.View> that lives INSIDE it. Never the other way round — an
 * Animated.View wrapping a Pressable swallows onPress on Android release.
 */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: PRESS_SPRING.tension,
      friction: PRESS_SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_SPRING.tension,
      friction: PRESS_SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
