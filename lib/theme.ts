import { MD3DarkTheme, MD3Theme } from 'react-native-paper';

/**
 * Custom MD3 Dark Theme
 *
 * Primary:    Vibrant Indigo/Violet  #7C7CFF
 * Background: Deep Charcoal         #121212
 * Surface:    Slightly lighter grey  #1E1E1E
 * Error:      Muted red             #CF6679
 * Warning:    Soft orange           #FFB74D  (used via tertiary)
 */
export const AppTheme: MD3Theme = {
  ...MD3DarkTheme,

  // ─── Color Scheme ───────────────────────────────────────────────────────────
  colors: {
    ...MD3DarkTheme.colors,

    // Primary – Indigo/Violet
    primary: '#7C7CFF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#3232C8',
    onPrimaryContainer: '#E0E0FF',

    // Secondary – Muted violet-teal
    secondary: '#9B8FD4',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#3E3670',
    onSecondaryContainer: '#D9D0FF',

    // Tertiary – Soft orange (for warnings / accents)
    tertiary: '#FFB74D',
    onTertiary: '#1A0F00',
    tertiaryContainer: '#7A4400',
    onTertiaryContainer: '#FFE0B2',

    // Error – Muted red
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#8B0000',
    onErrorContainer: '#FFD9DE',

    // Backgrounds
    background: '#121212',
    onBackground: '#E6E6E6',

    // Surfaces / Cards
    surface: '#1E1E1E',
    onSurface: '#E6E6E6',
    surfaceVariant: '#2A2A2A',
    onSurfaceVariant: '#A0A0B0',

    // Outline – subtle border colour
    outline: '#2A2A2A',
    outlineVariant: '#3A3A4A',

    // Inverse
    inverseSurface: '#E6E6E6',
    inverseOnSurface: '#121212',
    inversePrimary: '#3232C8',

    // Misc
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.6)',

    // Elevation overlays (MD3 surface tint)
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',   // Cards
      level2: '#232333',
      level3: '#282840',
      level4: '#2A2A44',
      level5: '#2D2D4A',
    },
  },

  // ─── Typography ─────────────────────────────────────────────────────────────
  // Uses the system default (Inter / Roboto depending on platform).
  // To use a custom font, load it with expo-font and replace "System" below.
  fonts: {
    ...MD3DarkTheme.fonts,
    displayLarge:   { ...MD3DarkTheme.fonts.displayLarge,   fontFamily: 'System', fontWeight: '700' },
    displayMedium:  { ...MD3DarkTheme.fonts.displayMedium,  fontFamily: 'System', fontWeight: '700' },
    displaySmall:   { ...MD3DarkTheme.fonts.displaySmall,   fontFamily: 'System', fontWeight: '600' },
    headlineLarge:  { ...MD3DarkTheme.fonts.headlineLarge,  fontFamily: 'System', fontWeight: '700' },
    headlineMedium: { ...MD3DarkTheme.fonts.headlineMedium, fontFamily: 'System', fontWeight: '600' },
    headlineSmall:  { ...MD3DarkTheme.fonts.headlineSmall,  fontFamily: 'System', fontWeight: '600' },
    titleLarge:     { ...MD3DarkTheme.fonts.titleLarge,     fontFamily: 'System', fontWeight: '600' },
    titleMedium:    { ...MD3DarkTheme.fonts.titleMedium,    fontFamily: 'System', fontWeight: '500' },
    titleSmall:     { ...MD3DarkTheme.fonts.titleSmall,     fontFamily: 'System', fontWeight: '500' },
    bodyLarge:      { ...MD3DarkTheme.fonts.bodyLarge,      fontFamily: 'System', fontWeight: '400' },
    bodyMedium:     { ...MD3DarkTheme.fonts.bodyMedium,     fontFamily: 'System', fontWeight: '400' },
    bodySmall:      { ...MD3DarkTheme.fonts.bodySmall,      fontFamily: 'System', fontWeight: '400' },
    labelLarge:     { ...MD3DarkTheme.fonts.labelLarge,     fontFamily: 'System', fontWeight: '500' },
    labelMedium:    { ...MD3DarkTheme.fonts.labelMedium,    fontFamily: 'System', fontWeight: '500' },
    labelSmall:     { ...MD3DarkTheme.fonts.labelSmall,     fontFamily: 'System', fontWeight: '400' },
  },
};
