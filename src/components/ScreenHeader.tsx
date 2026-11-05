import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_CONTENT_H, STATUS_PAD } from '../constants/config';

type Props = {
  title?: string;
  onBack?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
  surface?: boolean;
};

/**
 * The one header used by every screen (rule #12 of the self-check list).
 * paddingTop 44 keeps it clear of the status bar (rule #6).
 */
function ScreenHeader({
  title,
  onBack,
  leftSlot,
  rightSlot,
  tone = 'light',
  surface = true,
}: Props) {
  const dark = tone === 'dark';
  const titleColor = dark ? theme.colors.text.onDark : theme.colors.text.primary;

  let left: React.ReactNode = leftSlot;
  if (!left && onBack) {
    left = (
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[
          styles.circle,
          dark ? styles.circleDark : styles.circleLight,
        ]}>
        <ChevronLeft size={22} strokeWidth={1.5} color={dark ? theme.colors.text.onDark : theme.colors.text.primary} />
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.root,
        surface ? (dark ? styles.surfaceDark : styles.surfaceLight) : null,
      ]}>
      <View style={styles.row}>
        <View style={styles.side}>{left ? left : <View style={styles.spacer} />}</View>
        <View style={styles.center}>
          {title ? (
            <Text numberOfLines={1} style={[styles.title, { color: titleColor }]}>
              {title}
            </Text>
          ) : null}
        </View>
        <View style={[styles.side, styles.sideRight]}>
          {rightSlot ? rightSlot : <View style={styles.spacer} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: STATUS_PAD,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  surfaceLight: {
    backgroundColor: theme.colors.surface.header,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  surfaceDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.borderDark,
  },
  row: {
    height: HEADER_CONTENT_H,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: { width: 112, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  spacer: { width: 44, height: 44 },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  circleLight: {
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderColor: theme.colors.ui.border,
  },
  circleDark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: theme.colors.ui.borderDark,
  },
});

export default React.memo(ScreenHeader);
