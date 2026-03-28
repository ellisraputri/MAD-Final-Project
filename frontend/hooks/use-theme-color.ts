import { Colors } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { user } = useAppContext();

  const theme = user?.appearance ?? true; // default = light
  const mode = theme ? 'light' : 'dark';

  const colorFromProps = props[mode];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[mode][colorName];
  }
}