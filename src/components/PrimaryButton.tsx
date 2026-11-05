import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { IconType } from './StatCard';

type Props = {
  label: string;
  onPress: () => void;
  width: number;
  Icon?: IconType;
  colors?: string[];
  shadow?: object;
  disabled?: boolean;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Rule #20 button geometry: row / center / gap 10, icon exactly 24x24, the
 * label's lineHeight equal to the icon height. The Pressable is the PARENT and
 * the Animated.View lives INSIDE it (rule #8), so onPress always fires on
 * Android release builds.
 */
function PrimaryButton({
  label,
  onPress,
  width,
  Icon,
  colors = theme.gradients.coral,
  shadow = theme.shadows.coral,
  disabled = false,
  height = 60,
}: Props) {
  const press = usePressScale(0.96);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[{ width, height }, disabled ? styles.disabled : null]}>
      <Animated.View style={[styles.anim, shadow, { transform: [{ scale: press.scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} strokeWidth={2} color={theme.colors.text.onDark} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.55 },
  anim: { flex: 1, borderRadius: 18 },
  grad: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: theme.colors.text.onDark,
  },
});

export default React.memo(PrimaryButton);
