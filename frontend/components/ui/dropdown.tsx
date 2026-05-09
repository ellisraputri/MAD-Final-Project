import { useAppTheme } from "@/hooks/use-app-theme";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type LabelValue = {
  label: string;
  value: string;
};
type DropdownProps = {
  data: LabelValue[];
  placeholder?: string;
  value: string;
  onSelect?: (value: string) => void;
  heightCustom?: number;
};

export default function CustomDropdown({
  data,
  placeholder,
  value,
  onSelect,
  heightCustom,
}: DropdownProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme, heightCustom);

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        placeholderStyle={{
          color: theme.placeholderText,
          fontFamily: "Lato_400Regular",
        }}
        selectedTextStyle={{ color: theme.blackText }}
        itemTextStyle={{ color: theme.blackText }}
        containerStyle={{
          backgroundColor: theme.background,
        }}
        itemContainerStyle={{
          backgroundColor: theme.background,
        }}
        activeColor={theme.hoverBackground}
        value={value}
        onChange={(item) => onSelect?.(item.value)}
      />
    </View>
  );
}

export const createStyles = (theme: any, heightCustom?: number) => {
  const styles = StyleSheet.create({
    dropdown: {
      height: heightCustom ?? 40,
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontFamily: "Lato_400Regular",
    },
  });
  return styles;
};
