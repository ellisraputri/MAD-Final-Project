import { useThemeColor } from "./use-theme-color";


export function useAppTheme() {
  return {
    text: useThemeColor({}, 'text'),
    darkText: useThemeColor({}, 'darkText'),
    lighText: useThemeColor({}, 'lightText'),
    blackText: useThemeColor({}, 'blackText'),
    background: useThemeColor({}, 'background'),
    tint: useThemeColor({}, 'tint'),
    placeholder: useThemeColor({}, 'placeholder'),
    placeholderText: useThemeColor({}, 'placeholderText'),
    tabLine: useThemeColor({}, 'tabLine'),
  };
}