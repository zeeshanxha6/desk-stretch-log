import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import assets from '../assets';

export type ShellVariant = 'loader' | 'menu' | 'game' | 'result' | 'panel';

type Blob = {
  size: number;
  color: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const OVERLAYS: Record<ShellVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  result: theme.gradients.result,
  panel: theme.gradients.panel,
};

const BLOBS: Record<ShellVariant, Blob[]> = {
  loader: [
    { size: 260, color: 'rgba(46,140,122,0.28)', top: -60, left: -70 },
    { size: 200, color: 'rgba(255,138,92,0.18)', bottom: -40, right: -50 },
  ],
  menu: [
    { size: 220, color: 'rgba(255,138,92,0.10)', top: -70, right: -60 },
    { size: 260, color: 'rgba(46,140,122,0.08)', bottom: -90, left: -80 },
  ],
  game: [{ size: 280, color: 'rgba(46,140,122,0.07)', top: 120, right: -110 }],
  result: [
    { size: 300, color: 'rgba(127,232,197,0.14)', top: -90, right: -90 },
    { size: 240, color: 'rgba(255,138,92,0.16)', bottom: -70, left: -70 },
  ],
  panel: [{ size: 240, color: 'rgba(46,140,122,0.08)', top: -80, left: -70 }],
};

const BAR_STYLE: Record<ShellVariant, 'light-content' | 'dark-content'> = {
  loader: 'light-content',
  menu: 'dark-content',
  game: 'dark-content',
  result: 'light-content',
  panel: 'dark-content',
};

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

/**
 * Layer 1 background for every screen: the single contract background image,
 * a per-screen gradient overlay (rule #14 keeps Loader far from Menu) and
 * soft colour blobs for depth. Never a ScrollView (rule #3).
 */
function AppShell({ variant, children }: Props) {
  const blobs = BLOBS[variant];

  return (
    <View style={styles.root}>
      <StatusBar barStyle={BAR_STYLE[variant]} backgroundColor="transparent" translucent />
      <ImageBackground source={assets.bgGame} resizeMode="cover" style={styles.bg}>
        <LinearGradient
          colors={OVERLAYS[variant]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {blobs.map((b, i) => (
            <View
              key={variant + '-blob-' + i}
              style={[
                styles.blob,
                {
                  width: b.size,
                  height: b.size,
                  borderRadius: b.size / 2,
                  backgroundColor: b.color,
                  top: b.top,
                  bottom: b.bottom,
                  left: b.left,
                  right: b.right,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { flex: 1 },
  blob: { position: 'absolute' },
  content: { flex: 1 },
});

export default React.memo(AppShell);
