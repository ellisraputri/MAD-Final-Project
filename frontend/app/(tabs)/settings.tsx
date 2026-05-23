import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  Image,
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

  const [openTerm, setOpenTerm] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

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
    <>
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

        <TouchableOpacity style={styles.listItem} onPress={() => setOpenTerm(true)}>
          <Text style={styles.listText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.blackText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, { marginTop: 10 }]} onPress={() => setOpenHelp(true)}>
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

      {/* Terms & Conditions Modal */}
      <Modal
        visible={openTerm}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenTerm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>

              <Pressable onPress={() => setOpenTerm(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.blackText}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.modalText}>
                Welcome to our application. By using this app, you agree to
                comply with the following terms and conditions.
              </Text>

              <Text style={styles.modalSubtitle}>1. User Responsibilities</Text>

              <Text style={styles.modalText}>
                Users are responsible for maintaining the confidentiality of
                their account and ensuring all information provided is accurate.
              </Text>

              <Text style={styles.modalSubtitle}>2. Privacy</Text>

              <Text style={styles.modalText}>
                Your personal information will only be used to improve the
                application experience and will not be shared without consent.
              </Text>

              <Text style={styles.modalSubtitle}>3. Restrictions</Text>

              <Text style={styles.modalText}>
                Users must not misuse the application, attempt unauthorized
                access, or disrupt system functionality.
              </Text>

              <Text style={styles.modalSubtitle}>4. Changes</Text>

              <Text style={styles.modalText}>
                We reserve the right to update these terms at any time without
                prior notice.
              </Text>

              <Text style={styles.modalSubtitle}>5. Acknowledgment</Text>

              <Text style={styles.modalText}>
                This STEMM Lab app was developed with inspiration and guidance from our lecturers. 
              </Text>

              <View style={styles.creditContainer}>
                <View style={styles.creditItem}>
                  <Image source={require("@/assets/images/sir-baskara.jpeg")} style={styles.creditImage} />
                  <Text style={styles.creditName}>Sir Michael Baskara Laksana Adi Siek</Text>            
                </View>

                <View style={styles.creditItem}>
                  <Image source={require("@/assets/images/dr-tony.jpeg")} style={styles.creditImage} />
                  <Text style={styles.creditName}>Dr. Tony de Souza-Daw</Text>            
                </View>
              </View>

              <Text style={styles.modalText}>
                We appreciate their ideas and knowledge support through lab in class for the development process. All the images
                below are obtained from the La Trobe LMS.
              </Text>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal
        visible={openHelp}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help Center</Text>

              <Pressable onPress={() => setOpenHelp(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.blackText}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.modalSubtitle}>Need Assistance?</Text>

              <Text style={styles.modalText}>
                If you encounter any issues while using the application, please
                contact our support team.
              </Text>

              <Text style={styles.modalSubtitle}>Contact Support</Text>

              <Text style={styles.modalBoldText}>Email</Text>
              <Text style={styles.modalText}>
                ellarworkingfolder@gmail.com
              </Text>

              <Text style={styles.modalBoldText}>Operating Hours</Text>
              <Text style={styles.modalText}>
                Monday - Friday, 9:00 AM - 5:00 PM (GMT + 7)
              </Text>

              <Text style={styles.modalSubtitle}>App Version</Text>

              <Text style={styles.modalText}>Version 1.0.0</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },

    modalContainer: {
      width: "100%",
      maxHeight: "80%",
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 24,
      fontFamily: "Nunito_700Bold",
      color: theme.text,
    },

    modalSubtitle: {
      fontSize: 18,
      fontFamily: "Nunito_700Bold",
      color: theme.text,
      marginTop: 15,
      marginBottom: 8,
    },

    modalBoldText: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Lato_700Bold",
      color: theme.lightText,
      marginBottom: 5,
    },

    modalText: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
      marginBottom: 15,
    },

    creditContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 12,
      marginBottom: 12,
    },

    creditItem: {
      alignItems: "center",
      width: "45%",
    },

    creditImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },

    creditName: {
      fontSize: 16,
      fontFamily: "Nunito_700Bold",
      color: theme.text,
      textAlign: "center",
    },
  });
  return styles;
};
