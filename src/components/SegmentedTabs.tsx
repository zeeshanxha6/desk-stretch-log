import React from 'react';
import { StyleSheet, View } from 'react-native';
import Chip from './Chip';
import { splitRow } from '../utils/layout';

type Props = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  width: number;
};

const GAP = 8;

/** Chip row that switches the panels inside the settings screen. */
function SegmentedTabs({ tabs, active, onChange, width }: Props) {
  const chipW = splitRow(width, tabs.length, GAP);

  return (
    <View style={[styles.row, { gap: GAP }]}>
      {tabs.map(tab => (
        <Chip
          key={tab}
          label={tab}
          width={chipW}
          active={tab === active}
          onPress={() => onChange(tab)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default React.memo(SegmentedTabs);
