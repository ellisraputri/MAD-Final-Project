import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import CustomDropdown from "@/components/ui/dropdown";
import Button from "@/components/ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { logout } from "@/services/auth/auth";
import { router } from "expo-router";
import { useAppContext } from "@/context/AppContext";
import { editStudentDetail } from "@/services/student/student";
import { toast } from "sonner-native";
import { socket } from "@/services/socket";

const dropdownValue = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { user, setUser } = useAppContext();

  const [name, setName] = useState(user?.firstName);
  const [mode, setMode] = useState(user?.appearance ? "light" : "dark");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const inputRef = useRef<TextInput>(null);

  const saveName = async () => {
    if (!user || !tempName) return;

    setName(tempName);
    setIsEditing(false);

    const response = await editStudentDetail({
      firstName: tempName,
      appearance: user.appearance,
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    } else {
      toast.success(response.message);
      setUser({
        ...user,
        firstName: tempName,
      });
    }
  };

  const cancelEdit = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert("Confirm Action", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          if (socket.connected) {
            socket.disconnect();
          }

          const res = await logout();
          alert(res.message);
          if (res.success) router.push("/(auth)/login");
        },
      },
    ]);
  };

  useEffect(() => {
    if (user) {
      setMode(user.appearance ? "light" : "dark");
    }
  }, [user]);

  const handleThemeChange = async (value: string) => {
    if (!user) return;
    const isLight = value === "light";
    setMode(value);

    const response = await editStudentDetail({
      firstName: user.firstName,
      appearance: isLight,
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    } else {
      toast.success(response.message);
      setUser({
        ...user,
        appearance: isLight,
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={styles.title}>Settings</Text>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name ? name[0] : "-"}</Text>
      </View>

      {/* First Name */}
      <View style={styles.section}>
        <Text style={styles.label}>First Name</Text>

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            value={tempName}
            onChangeText={setTempName}
            editable={isEditing}
            style={styles.input}
            underlineColorAndroid="transparent"
          />

          {!isEditing ? (
            <TouchableOpacity
              onPress={() => {
                setIsEditing(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 50);
              }}
            >
              <Ionicons name="pencil" size={20} color={theme.blackText} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={saveName}>
                <Ionicons name="checkmark" size={24} color="green" />
              </TouchableOpacity>

              <TouchableOpacity onPress={cancelEdit}>
                <Ionicons name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Mode */}
      <View style={styles.section}>
        <Text style={styles.label}>Mode</Text>

        <CustomDropdown
          data={dropdownValue}
          value={mode}
          placeholder="Select mode"
          onSelect={handleThemeChange}
        />
      </View>

      {/* General Info */}
      <Text style={styles.sectionTitle}>General Info</Text>

      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listText}>Terms & Conditions</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.blackText} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.listItem, { marginTop: 10 }]}>
        <Text style={styles.listText}>Help Center</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.blackText} />
      </TouchableOpacity>

      {/* Logout */}
      <Button
        onPress={handleLogout}
        text="Logout"
        width={300}
        fontSize={20}
        marginTop={60}
      />
    </ScrollView>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },

    title: {
      fontSize: 28,
      fontFamily: "Nunito_700Bold",
      fontWeight: "600",
      color: theme.text,
      marginTop: 15,
    },

    avatar: {
      alignSelf: "center",
      width: 120,
      height: 120,
      borderRadius: 80,
      backgroundColor: "#6FB3B8",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 30,
      marginTop: 10,
    },

    avatarText: {
      fontSize: 60,
      color: "white",
      fontFamily: "Lato_400Regular",
    },

    section: {
      marginBottom: 30,
    },

    label: {
      fontSize: 20,
      color: theme.text,
      fontFamily: "Nunito_700Bold",
    },

    inputRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: theme.text,
    },

    input: {
      flex: 1,
      fontSize: 16,
      color: theme.blackText,
      fontFamily: "Lato_400Regular",
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      fontFamily: "Nunito_700Bold",
      marginBottom: 5,
    },

    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: theme.text,
      paddingVertical: 12,
    },

    listText: {
      fontSize: 18,
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },
    iconContainer: {
      flexDirection: "row",
      width: 60,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
  return styles;
};
