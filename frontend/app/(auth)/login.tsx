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
import Button from "@/components/ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { loginAndGetData } from "@/services/auth/auth";
import { auth } from "@/services/firebase";
import { getStudentDetail } from "@/services/student/student";
import PasswordInput from "@/components/ui/password-input";

export default function LoginScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    if (email === "" || password === "") {
      alert("Fields cannot be empty");
      return;
    }
    setIsLoading(true);

    const res = await loginAndGetData({ email, password });
    alert(res.message);
    setIsLoading(false);

    if (res.success) {
      await getStudentDetail(); // force session validation first
      router.replace("/team_confirmation");
    }
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
          testID="email_input"
          placeholder="Enter your email"
          placeholderTextColor={theme.placeholderText}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <PasswordInput
          placeholder="Enter your password"
          password={password}
          setPassword={setPassword}
        />

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          text="Login"
          width={200}
          fontSize={20}
          marginTop={60}
          isLoading={isLoading}
        />

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don&rsquo;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Register here</Text>
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
      padding: 24,
      backgroundColor: theme.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -18,
    },
    label: {
      fontSize: 20,
      color: theme.text,
      fontFamily: "Nunito_700Bold",
      marginTop: 24,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 16,
      paddingVertical: 8,
      fontFamily: "Lato_400Regular",
      marginTop: 8,
      color: theme.blackText,
    },
    registerText: {
      fontSize: 16,
      color: theme.text,
      marginRight: 2,
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 40,
    },
    registerLink: {
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
