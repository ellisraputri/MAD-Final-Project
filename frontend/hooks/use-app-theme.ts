import { useThemeColor } from "./use-theme-color";
import { useAppContext } from "@/context/AppContext";

export function useAppTheme() {
  const { user } = useAppContext();
  const theme = user?.appearance ?? true;
  const mode = theme ? "light" : "dark";

  return {
    isDark: mode === "dark",
    text: useThemeColor({}, "text"),
    darkText: useThemeColor({}, "darkText"),
    lightText: useThemeColor({}, "lightText"),
    blackText: useThemeColor({}, "blackText"),
    background: useThemeColor({}, "background"),
    hoverBackground: useThemeColor({}, "hoverBackground"),
    greyBackground: useThemeColor({}, "greyBackground"),
    tint: useThemeColor({}, "tint"),
    placeholder: useThemeColor({}, "placeholder"),
    placeholderText: useThemeColor({}, "placeholderText"),
    tabLine: useThemeColor({}, "tabLine"),
    activityCard: useThemeColor({}, "activityCard"),
    activityTitle: useThemeColor({}, "activityTitle"),
  };
}
