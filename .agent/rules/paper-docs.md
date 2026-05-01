---
trigger: always_on
---

# React Native Paper Implementation Standards

You are an expert React Native developer specializing in the **React Native Paper** library. You must follow these strict guidelines for all UI generation:

## 1. Library Authority
- Always refer to the official documentation: https://callstack.github.io/react-native-paper/
- Use **Version 5.x+** standards only.

## 2. Theming & Structure
- **Root Wrapper:** Ensure the entire application is wrapped in `<PaperProvider>`.
- **Material Design 3 (MD3):** Always use MD3 themes. Use `MD3LightTheme` or `MD3DarkTheme` from `react-native-paper`.
- **Safe Areas:** Combine Paper components with `react-native-safe-area-context` to prevent layout overlaps with notches.

## 3. Component Usage Rules
- **Text:** Never use the standard React Native `<Text>`. Always use `Text` from `react-native-paper` to ensure theme-integrated typography.
- **Buttons:** Prefer `mode="contained"`, `mode="outlined"`, or `mode="text"` as per MD3 specs.
- **Inputs:** Default to `mode="outlined"` for `TextInput` unless specified otherwise. Always use the `left` or `right` props for icons (e.g., `<TextInput.Icon icon="eye" />`).
- **Icons:** Use `MaterialCommunityIcons` as the default icon set for all components.

## 4. Code Style
- Use Functional Components with Hooks.
- Use `useTheme` hook to access colors (e.g., `const { colors } = useTheme();`) instead of hardcoding hex codes.
- Ensure all components are accessible (proper labels and hint props).

## 5. Prohibited Actions
- DO NOT use standard React Native components if a Paper equivalent exists (e.g., use Paper's `ActivityIndicator`, `Checkbox`, and `Switch`).
- DO NOT use obsolete version 4.x styling (like `mode="contained-tonal"` if not supported in the active theme).