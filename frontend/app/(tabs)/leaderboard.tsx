import Loading from "@/components/ui/loading";
import PodiumCard from "@/components/ui/podium-card";
import RankingCard from "@/components/ui/ranking-card";
import { useAppContext } from "@/context/AppContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getTopRanking } from "@/services/result/result";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const dropdownData = [
  { label: "Global", value: "global", params: "" },
  { label: "Activity 1", value: "activity1", params: "1" },
  { label: "Activity 2", value: "activity2", params: "2" },
  { label: "Activity 3", value: "activity3", params: "3" },
  { label: "Activity 4", value: "activity4", params: "4" },
  { label: "Activity 5", value: "activity5", params: "5" },
  { label: "Activity 6", value: "activity6", params: "6" },
  { label: "Activity 7", value: "activity7", params: "7" },
];

export default function LeaderboardScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { team } = useAppContext();

  const [dropdownValue, setDropdownValue] = useState("global");
  const [results, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateDisplayScore = (score: number) => {
    const num = Math.round(score * 100); 
    return `${num}%`
  }

  const fetchRanking = async (activityParam?: string) => {
    try {
      setLoading(true);
      const res = await getTopRanking(activityParam);

      if (res?.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const param = dropdownData.find(item => item.value === dropdownValue)?.params;
    fetchRanking(param);
  }, [dropdownValue]);

  const top1 = results[0];
  const top2 = results[1];
  const top3 = results[2];


  if (loading) {
    return (
      <Loading/>
    );
  }

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
        {top3 && (
          <PodiumCard
            rank={3}
            name={results[2].teamName}
            score={calculateDisplayScore(results[2].score)}
            imageUrl={results[2].imageUrl}
          />
        )}

        
        {top1 && (
          <View style={{ marginBottom: 30 }}>
              <PodiumCard
                rank={1}
                name={results[0].teamName}
                score={calculateDisplayScore(results[0].score)}
                imageUrl={results[0].imageUrl}
              />
          </View>
        )}
        
        {top2 && (
          <PodiumCard
            rank={2}
            name={results[1].teamName}
            score={calculateDisplayScore(results[1].score)}
            imageUrl={results[1].imageUrl}
          />
        )}
      </View>

      {/* Your ranking list below */}
      <View style={styles.rankingList}>
          {results.slice(3).map((item, i) => (
              <RankingCard 
              key={i}
                rank={item.rank}
                score={calculateDisplayScore(item.score)}
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
