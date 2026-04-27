import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import Svg, { Polygon } from "react-native-svg";
import CustomDropdown from "@/components/ui/dropdown";
import Button from "@/components/ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { registerAndGetData } from "@/services/auth/auth";

const gradeDropdown = [
  { label: "1 (SD Kelas 1)", value: "1" },
  { label: "2 (SD Kelas 2)", value: "2" },
  { label: "3 (SD Kelas 3)", value: "3" },
  { label: "4 (SD Kelas 4)", value: "4" },
  { label: "5 (SD Kelas 5)", value: "5" },
  { label: "6 (SD Kelas 6)", value: "6" },
  { label: "7 (SMP Kelas 1)", value: "7" },
  { label: "8 (SMP Kelas 2)", value: "8" },
  { label: "9 (SMP Kelas 3)", value: "9" },
  { label: "10 (SMA Kelas 1)", value: "10" },
  { label: "11 (SMA Kelas 2)", value: "11" },
  { label: "12 (SMA Kelas 3)", value: "12" },
];

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;

    if (email === "" || password === "" || firstName === "" || grade === "") {
      alert("Fields cannot be empty");
    }
    setIsLoading(true);

    const res = await registerAndGetData({ email, password, firstName, grade });
    alert(res.message);
    setIsLoading(false);

    if (res.success) router.replace("/team_confirmation");
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={10} // extra space above keyboard
      enableAutomaticScroll={true} // auto scrolls to focused input
    >
      {/* Header Image */}
      <ImageBackground
        source={require("../../assets/images/header.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        ></Image>

        <Image
          source={require("../../assets/images/text_logo.png")}
          style={styles.textLogo}
        ></Image>

        <View style={styles.overlay}>
          <Text style={styles.subtitle}>
            Simulate Reality. Sense the Science
          </Text>
        </View>

        <Svg
          height="80"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={styles.diagonal}
        >
          <Polygon
            points="0,60 0,65 0,70 0,75 2,79 3,80 4,79 100,0 100,100 0,100"
            fill={theme.background}
          />
        </Svg>
      </ImageBackground>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={theme.placeholderText}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={theme.placeholderText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          placeholder="Enter your first name"
          placeholderTextColor={theme.placeholderText}
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />

        <Text style={styles.label}>Grade</Text>
        <CustomDropdown
          data={gradeDropdown}
          value={grade}
          placeholder="Select grade"
          onSelect={setGrade}
        />

        <Button
          onPress={handleRegister}
          text="Register"
          width={200}
          fontSize={20}
          marginTop={30}
          isLoading={isLoading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      height: 300,
      justifyContent: "flex-end",
    },
    form: {
      flex: 1,
      paddingTop: 0,
      padding: 24,
      backgroundColor: theme.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -18,
    },
    label: {
      fontSize: 18,
      color: theme.text,
      fontFamily: "Nunito_700Bold",
      marginTop: 24,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 14,
      paddingVertical: 8,
      fontFamily: "Lato_400Regular",
      marginTop: 0,
      color: theme.blackText,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 40,
    },
    loginText: {
      fontSize: 16,
      color: theme.text,
    },
    loginLink: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      textDecorationLine: "underline",
    },
    diagonal: {
      position: "absolute",
      bottom: -1,
      width: "100%",
    },
    logo: {
      position: "absolute",
      top: 60,
      left: 15,
      width: 60,
      height: 80,
      resizeMode: "contain",
    },
    textLogo: {
      position: "absolute",
      top: 150,
      left: 20,
      width: 180,
      height: 50,
      resizeMode: "contain",
    },
    overlay: {
      position: "absolute",
      bottom: 60,
      left: 0,
      right: 20,
      padding: 20,
    },
    subtitle: {
      color: "#fff",
      fontSize: 18,
      fontFamily: "Lato_700Bold",
    },
  });
  return styles;
};
