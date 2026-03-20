import PodiumCard from "@/components/ui/podium-card";
import RankingCard from "@/components/ui/ranking-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const dropdownData = [
  { label: "Global", value: "global" },
  { label: "Activity 1", value: "activity1" },
  { label: "Activity 2", value: "activity2" },
  { label: "Activity 3", value: "activity3" },
  { label: "Activity 4", value: "activity4" },
  { label: "Activity 5", value: "activity5" },
  { label: "Activity 6", value: "activity6" },
  { label: "Activity 7", value: "activity7" },
];

export default function LeaderboardScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [dropdownValue, setDropdownValue] = useState("global");
  const [results, setResult] = useState([
    {rank: "4", teamName: "hehe1", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "5", teamName: "ooopp", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "6", teamName: "coba lihat", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "7", teamName: "wink", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "8", teamName: "fffff", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "9", teamName: "askaks", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
    {rank: "10", teamName: "fasaffff", score: "80%", imageUrl: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"},
  
  ])

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}
    >
      
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>

        <Dropdown
          style={[styles.dropdown, theme.isDark && {borderColor: "white", borderWidth: 1}]}
          data={dropdownData}
          labelField="label"
          valueField="value"
          value={dropdownValue}
          onChange={item => setDropdownValue(item.value)}
          selectedTextStyle={{ color: theme.blackText }}
          placeholderStyle={{ color: theme.placeholderText }}
          itemTextStyle={{ color: theme.blackText }}
          containerStyle={{
            backgroundColor: theme.background, 
          }}
          itemContainerStyle={{
            backgroundColor: theme.background, 
          }}
          activeColor={theme.hoverBackground}
        />
      </View>

      <View style={styles.podiumContainer}>
        <PodiumCard
          rank={3}
          name="Ayam"
          score="95%"
          imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
        />
        <View style={{ marginBottom: 30 }}>
          <PodiumCard
            rank={1}
            name="Kita Menang Yey"
            score="100%"
            imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
          />
        </View>
        <PodiumCard
          rank={2}
          name="Api"
          score="98%"
          imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
        />
      </View>

      {/* Your ranking list below */}
      <View style={styles.rankingList}>
          {results.map((item, i) => (
              <RankingCard 
              key={i}
                rank={item.rank}
                score={item.score}
                teamName={item.teamName}
                imageUrl={item.imageUrl}
              />
          ))}
      </View>

      <View style={{marginTop: 10}}>
        <Text style={styles.section}>
          My Team Best:
        </Text>

        <RankingCard 
          rank="1"
          score="100%"
          teamName="Kita Menang Yey"
          imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
        />
      </View>

      {dropdownValue !== "global" && 
        <View>
          <Text style={styles.section}>
            My Team Latest Attempt:
          </Text>

          <RankingCard 
            rank="1"
            score="100%"
            teamName="Kita Menang Yey"
            imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
          />
        </View>
      }
      
      
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

    header: {
      marginTop: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: 28,
      fontFamily: "Nunito_700Bold",
      fontWeight: "600",
      color: theme.text,
    },

    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      height: 40,
      width: 150,
      padding: 10,
      elevation: 3,
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    dropdownText: {
      fontSize: 18,
      color: theme.blackText
    },

    podiumContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 35,
    },

    firstCard: {
      alignItems: "center",
      marginHorizontal: 10,
    },

    sideCard: {
      alignItems: "center",
    },

    rankingList: {
      gap: 15,
      marginTop: 20,
    },

    section: {
      fontFamily: "Lato_700Bold",
      fontSize: 18,
      marginTop: 40,
      marginBottom: 10,
      color: theme.blackText,
    },
  });
  return styles;
}
