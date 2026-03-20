import { withLayoutContext, useLocalSearchParams, useRouter } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function Layout() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/activity")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.isDark? theme.lightText : theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, theme.isDark? {color: theme.lightText} : {color: theme.text}]}>Activity {id}</Text>
      </View>

      <TopTabs
        screenOptions={{
          swipeEnabled: false,
          tabBarActiveTintColor: theme.text,
          tabBarIndicatorStyle: {
            backgroundColor: theme.text,
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontFamily: "Lato_700Bold",
            color: theme.text,
          },
          tabBarStyle: {
            backgroundColor: theme.background
          }
        }}
      >
        <TopTabs.Screen
          name="instructions"
          options={{ title: "Instruction" }}
        />

        <TopTabs.Screen
          name="activity"
          options={{ title: "Activity" }}
        />

        <TopTabs.Screen
          name="results"
          options={{ title: "Results" }}
        />
      </TopTabs>
    </SafeAreaView>
  );
}

const createStyles = (theme:any) => {
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: theme.tint,
    },
    backButton: {
      marginRight: 8,
      padding: 4,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "Nunito_700Bold",
    },
  });
  return styles;
}