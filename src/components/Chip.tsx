import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  width: number;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Duration / tab chip. Explicit width and height — never intrinsic sizing. */
function Chip({ label, active, onPress, width, height = 40 }: Props) {
  const press = usePressScale(0.94);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={{ width, height }}>
      <Animated.View
        style={[
          styles.anim,
          active ? styles.active : styles.idle,
          { borderRadius: height / 2, transform: [{ scale: press.scale }] },
        ]}>
        <Text
          style={[styles.label, active ? styles.labelActive : styles.labelIdle]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  anim: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  idle: {
    backgroundColor: theme.colors.bg.primary,
    borderColor: theme.colors.ui.border,
  },
  active: {
    backgroundColor: 'rgba(46,140,122,0.12)',
    borderColor: theme.colors.brand.teal,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
  },
  labelIdle: { color: theme.colors.text.secondary, fontWeight: '600' },
  labelActive: { color: theme.colors.brand.teal, fontWeight: '800' },
});

export default React.memo(Chip);
