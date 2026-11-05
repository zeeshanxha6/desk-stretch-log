import React, { useCallback, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import theme from '../constants/theme';
import { WIGGLE_MS } from '../constants/config';
import { PICKER_TILE_H } from '../utils/layout';
import { spriteAt } from '../assets';

type Props = {
  name: string;
  sub: string;
  spriteIndex: number;
  width: number;
  onPress: () => void;
  rightSlot?: React.ReactNode;
  height?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * One stretch in the picker. Pressing it wiggles the icon square once — the
 * rotation runs on the native driver (transform only) while the tile itself
 * scales down, and the Pressable stays the parent so the tap always lands.
 */
function StretchTile({
  name,
  sub,
  spriteIndex,
  width,
  onPress,
  rightSlot,
  height = PICKER_TILE_H,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
    wiggle.setValue(0);
    Animated.timing(wiggle, {
      toValue: 1,
      duration: WIGGLE_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [scale, wiggle]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const rotate = wiggle.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '3deg', '0deg', '-3deg', '0deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={{ width, height }}>
      <Animated.View style={[styles.tile, { transform: [{ scale }] }]}>
        <Animated.View style={[styles.iconSquare, { transform: [{ rotate }] }]}>
          <Image source={spriteAt(spriteIndex)} style={styles.sprite} resizeMode="contain" />
        </Animated.View>
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {sub}
          </Text>
        </View>
        {rightSlot ? (
          rightSlot
        ) : (
          <ChevronRight size={20} strokeWidth={1.5} color={theme.colors.brand.teal} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 12,
    gap: 12,
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconSquare: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(46,140,122,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: { width: 34, height: 34 },
  textCol: { flex: 1, justifyContent: 'center' },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: theme.colors.text.primary,
  },
  sub: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StretchTile);
