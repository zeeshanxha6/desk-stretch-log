import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen, { Recap } from './src/screens/GameOverScreen';
import WeekGridScreen from './src/screens/WeekGridScreen';
import StretchListScreen from './src/screens/StretchListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useBreakLog } from './src/hooks/useBreakLog';
import theme from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'week' | 'stretches' | 'settings';

/**
 * State machine only — every bit of gameplay lives in the screens and in
 * src/game. `gameover` is a first-class state (rule #12) so a finished break
 * always lands on its own reviewable screen.
 */
function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [recap, setRecap] = useState<Recap | null>(null);

  const data = useBreakLog();
  const { record, clearNewBreak } = data;

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => {
    clearNewBreak();
    setScreen('game');
  }, [clearNewBreak]);

  const handleGameOver = useCallback(
    (stretchId: string, heldSeconds: number) => {
      const result = record(stretchId, heldSeconds);
      setRecap({
        stretchName: result.stretchName,
        heldSeconds,
        minute: result.entry.minute,
        todayCount: result.todayCount,
        target: result.target,
        reached: result.todayCount >= result.target,
      });
      setScreen('gameover');
    },
    [record],
  );

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          breaks={data.log}
          todayCount={data.todayCount}
          target={data.target}
          workStart={data.workStart}
          workEnd={data.workEnd}
          gap={data.gap}
          newBreakId={data.newBreakId}
          onStart={goGame}
          onWeek={() => setScreen('week')}
          onStretches={() => setScreen('stretches')}
          onSettings={() => setScreen('settings')}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          stretches={data.stretches}
          log={data.log}
          todayCount={data.todayCount}
          target={data.target}
          onBack={goMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' && recap ? (
        <GameOverScreen recap={recap} onPlayAgain={goGame} onMenu={goMenu} />
      ) : null}

      {screen === 'week' ? (
        <WeekGridScreen
          days={data.days}
          target={data.target}
          monthTotal={data.monthTotal}
          best={data.best}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'stretches' ? (
        <StretchListScreen
          stretches={data.stretches}
          onBack={goMenu}
          onRename={data.renameStretch}
          onReorder={data.reorderStretch}
          onAdd={data.addStretch}
        />
      ) : null}

      {screen === 'settings' ? (
        <SettingsScreen
          log={data.log}
          stretches={data.stretches}
          top3={data.top3}
          gap={data.gap}
          target={data.target}
          workStart={data.workStart}
          workEnd={data.workEnd}
          sounds={data.prefs.sounds}
          localBackup={data.prefs.localBackup}
          onBack={goMenu}
          onTarget={data.setTarget}
          onWorkStart={data.shiftWorkStart}
          onWorkEnd={data.shiftWorkEnd}
          onToggleSounds={() => data.togglePref('sounds')}
          onToggleBackup={() => data.togglePref('localBackup')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});

export default App;
