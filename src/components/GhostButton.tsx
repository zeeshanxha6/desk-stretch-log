import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { IconType } from './StatCard';

type Props = {
  label: string;
  onPress: () => void;
  width: number;
  Icon?: IconType;
  tone?: 'light' | 'dark';
  height?: number;
  fontSize?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Secondary button — same 24x24 icon size as PrimaryButton (rule #20). */
function GhostButton({
  label,
  onPress,
  width,
  Icon,
  tone = 'light',
  height = 48,
  fontSize = 13,
}: Props) {
  const press = usePressScale(0.95);
  const dark = tone === 'dark';
  const color = dark ? theme.colors.text.onDark : theme.colors.brand.teal;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width, height }}>
      <Animated.View
        style={[
          styles.anim,
          dark ? styles.dark : styles.light,
          { transform: [{ scale: press.scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} strokeWidth={1.5} color={color} /> : null}
          <Text style={[styles.label, { color, fontSize }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  anim: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  light: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: theme.colors.ui.border,
  },
  dark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: theme.colors.ui.borderDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default React.memo(GhostButton);
