/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';
   
export const Colors = {
  light: {
    text: '#388087',
    darkText: '#295F6B',
    lightText: '#6FB3B8',
    blackText: '#000',
    background: '#fff',
    hoverBackground: '#f3f3f3',
    greyBackground: '#f3f3f3',
    tint: '#f6f6f2',
    placeholder: '#D9D9D9',
    placeholderText: '#888',
    tabLine: '#BADFE7',
    activityCard: '#f6f6f2',
    activityTitle: '#143336',
  },
  dark: {
    text: '#6FB3B8',
    darkText: '#388087',
    lightText: '#BADFE7',
    blackText: '#F6F6F2',
    background: '#1E1E1E',
    hoverBackground: '#424040',
    greyBackground: '#f3f3f3',
    tint: '#295F6B',
    placeholder: '#D9D9D9',
    placeholderText: '#888',
    tabLine: '#295F6B',
    activityCard: '#143336',
    activityTitle: '#f6f6f2',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
