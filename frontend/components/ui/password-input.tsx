import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type PasswordInputProps = {
  placeholder: string;
  password: string;
  setPassword: (password: string) => void;
};

export default function PasswordInput({
  placeholder,
  password,
  setPassword,
}: PasswordInputProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        testID="password_input"
        placeholder={placeholder}
        placeholderTextColor={theme.placeholderText}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        style={styles.passwordInput}
      />

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Ionicons
          size={22}
          color={theme.text}
          name={showPassword ? "eye" : "eye-off"}
        />
      </TouchableOpacity>
    </View>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    passwordContainer: {
      position: "relative",
      justifyContent: "center",
    },

    passwordInput: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 16,
      paddingVertical: 8,
      paddingRight: 40,
      fontFamily: "Lato_400Regular",
      marginTop: 8,
      color: theme.blackText,
    },

    eyeIcon: {
      position: "absolute",
      right: 0,
      top: "50%",
      transform: [{ translateY: -10 }],
    },
  });
  return styles;
};
