import React, { useCallback, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Check, ChevronDown, ChevronUp, Pencil, Plus } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StretchTile from '../components/StretchTile';
import PrimaryButton from '../components/PrimaryButton';
import theme from '../constants/theme';
import { Stretch } from '../game/breakLog';
import { usePressScale } from '../hooks/usePressScale';
import { CONTENT_W, PAGE_PAD, PICKER_TILE_H, TILE_GAP } from '../utils/layout';

const HIT = { top: 6, bottom: 6, left: 6, right: 6 };
const ROW_CTRL = 36;

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

function MiniButton({
  Icon,
  onPress,
  accessibilityLabel,
}: {
  Icon: IconType;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const press = usePressScale(0.9);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.miniHit}>
      <Animated.View style={[styles.mini, { transform: [{ scale: press.scale }] }]}>
        <Icon size={18} strokeWidth={1.5} color={theme.colors.brand.teal} />
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  stretches: Stretch[];
  onBack: () => void;
  onRename: (id: string, name: string) => void;
  onReorder: (id: string, delta: number) => void;
  onAdd: () => void;
};

function StretchListScreen({ stretches, onBack, onRename, onReorder, onAdd }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const visible = stretches.slice(0, 5);

  const beginEdit = useCallback((id: string, name: string) => {
    setEditingId(id);
    setDraft(name);
  }, []);

  const commitEdit = useCallback(() => {
    if (editingId) {
      onRename(editingId, draft);
    }
    setEditingId(null);
    setDraft('');
  }, [draft, editingId, onRename]);

  return (
    <AppShell variant="panel">
      <ScreenHeader title="STRETCH LIST" onBack={onBack} />

      <View style={styles.body}>
        <Text style={styles.lede}>
          Five personal stretches. Reorder them or rename one — the picker shows this order.
        </Text>

        <View style={styles.list}>
          {visible.map(s =>
            editingId === s.id ? (
              <View key={s.id} style={[styles.editRow, { height: PICKER_TILE_H }]}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  autoFocus
                  maxLength={18}
                  placeholder="STRETCH NAME"
                  placeholderTextColor={theme.colors.text.muted}
                  style={styles.input}
                />
                <MiniButton Icon={Check} onPress={commitEdit} accessibilityLabel="Save name" />
              </View>
            ) : (
              <View key={s.id} style={styles.tileSlot}>
                <StretchTile
                  name={s.name}
                  sub={s.logged + ' LOGGED'}
                  spriteIndex={s.spriteIndex}
                  width={CONTENT_W}
                  height={PICKER_TILE_H}
                  onPress={() => beginEdit(s.id, s.name)}
                  rightSlot={
                    <View style={styles.rowCtrls}>
                      <MiniButton
                        Icon={ChevronUp}
                        onPress={() => onReorder(s.id, -1)}
                        accessibilityLabel={s.name + ' move up'}
                      />
                      <MiniButton
                        Icon={ChevronDown}
                        onPress={() => onReorder(s.id, 1)}
                        accessibilityLabel={s.name + ' move down'}
                      />
                      <MiniButton
                        Icon={Pencil}
                        onPress={() => beginEdit(s.id, s.name)}
                        accessibilityLabel={s.name + ' rename'}
                      />
                    </View>
                  }
                />
              </View>
            ),
          )}
        </View>

        <View style={styles.spacer} />

        <Text style={styles.hint}>A SIXTH STRETCH WAITS BEHIND THE FIVE</Text>
        <PrimaryButton label="ADD STRETCH" Icon={Plus} width={CONTENT_W} height={56} onPress={onAdd} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: PAGE_PAD,
    paddingTop: 12,
    paddingBottom: 24,
  },
  lede: {
    alignSelf: 'flex-start',
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  list: { width: CONTENT_W },
  tileSlot: { marginBottom: TILE_GAP },
  editRow: {
    width: CONTENT_W,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: TILE_GAP,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.brand.teal,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
    padding: 0,
  },
  rowCtrls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniHit: { width: ROW_CTRL, height: ROW_CTRL },
  mini: {
    flex: 1,
    borderRadius: ROW_CTRL / 2,
    backgroundColor: 'rgba(46,140,122,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { flex: 1, minHeight: 12 },
  hint: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
});

export default StretchListScreen;
