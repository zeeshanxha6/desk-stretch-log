import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type IconType = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export type StatItem = {
  key: string;
  Icon: IconType;
  value: string;
  label: string;
  valueColor: string;
};

type Props = {
  Icon: IconType;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The single stat card used on every screen (rule #21). Icons come from lucide
 * (inline SVG on a fixed 22x22 canvas) — never an AI sprite, so every pill in a
 * row is pixel-identical apart from its colour.
 *
 * `width: '100%'` and NOT `flex: 1` — the card sits inside a flex:1 slot and a
 * second flex:1 would collapse it to ~0px (rule #19a).
 */
function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '33' }]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={1.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * A row of stat cards. Renders nothing unless at least two cards carry a real
 * value — a lone pill looks orphaned and an empty one reads as a broken
 * skeleton loader.
 */
export function StatRow({ items, gap = 12 }: { items: StatItem[]; gap?: number }) {
  const visible = items.filter(i => i.value.length > 0 && i.value !== '0');
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={[styles.row, { gap }]}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            Icon={item.Icon}
            value={item.value}
            label={item.label}
            valueColor={item.valueColor}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  slot: { flex: 1 },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface.card,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dot: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 26,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StatCard);
