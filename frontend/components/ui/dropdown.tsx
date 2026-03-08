import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type LabelValue = {
    label: string,
    value: string
}
type DropdownProps = {
  data: LabelValue[]
  placeholder?: string
  value: string
  onSelect?: (value: string) => void
}

export default function CustomDropdown({data, placeholder, value, onSelect}: DropdownProps) {
  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        placeholderStyle={{color: "#888", fontFamily: "Lato_400Regular"}}
        value={value}
        onChange={item => onSelect?.(item.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  dropdown: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#388087",
    fontFamily: 'Lato_400Regular',
  },
});