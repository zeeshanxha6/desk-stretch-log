import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

function RoundButton({
  Icon,
  onPress,
  accessibilityLabel,
}: {
  Icon: IconType;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const press = usePressScale(0.92);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.roundHit}>
      <Animated.View style={[styles.round, { transform: [{ scale: press.scale }] }]}>
        <Icon size={20} strokeWidth={1.5} color={theme.colors.brand.teal} />
      </Animated.View>
    </Pressable>
  );
}

/** A 56px settings row with two 48x48 circular controls. */
function Stepper({ label, value, onMinus, onPlus }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <View style={styles.controls}>
        <RoundButton Icon={Minus} onPress={onMinus} accessibilityLabel={label + ' decrease'} />
        <RoundButton Icon={Plus} onPress={onPlus} accessibilityLabel={label + ' increase'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  textCol: { flex: 1, justifyContent: 'center' },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
  value: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundHit: { width: 44, height: 44 },
  round: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: 'rgba(46,140,122,0.10)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Stepper);
