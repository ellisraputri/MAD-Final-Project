import { withLayoutContext, useLocalSearchParams, useRouter } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function Layout() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/activity")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#295F6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity {id}</Text>
      </View>

      <TopTabs
        screenOptions={{
          swipeEnabled: false,
          tabBarActiveTintColor: "#BADFE7",
          tabBarIndicatorStyle: {
            backgroundColor: "#BADFE7",
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontFamily: "Lato_700Bold",
            color: "#295F6B",
          },
          tabBarStyle: {
            backgroundColor: "#fff"
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
      </TopTabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F6F6F2",
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#295F6B",
  },
});