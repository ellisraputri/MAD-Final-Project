import { useColorScheme } from "react-native";
import { useThemeColor } from "./use-theme-color";


export function useAppTheme() {
  const scheme = useColorScheme();

  return {
    isDark: scheme==="dark",
    text: useThemeColor({}, 'text'),
    darkText: useThemeColor({}, 'darkText'),
    lightText: useThemeColor({}, 'lightText'),
    blackText: useThemeColor({}, 'blackText'),
    background: useThemeColor({}, 'background'),
    hoverBackground: useThemeColor({}, 'hoverBackground'),
    greyBackground: useThemeColor({}, 'greyBackground'),
    tint: useThemeColor({}, 'tint'),
    placeholder: useThemeColor({}, 'placeholder'),
    placeholderText: useThemeColor({}, 'placeholderText'),
    tabLine: useThemeColor({}, 'tabLine'),
    activityCard: useThemeColor({}, 'activityCard'),
    activityTitle: useThemeColor({}, 'activityTitle'),
  };
}