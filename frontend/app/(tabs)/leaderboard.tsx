import Loading from "@/components/ui/loading";
import PodiumCard from "@/components/ui/podium-card";
import RankingCard from "@/components/ui/ranking-card";
import { useAppContext } from "@/context/AppContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getActivityRank, getGlobalRank } from "@/services/summary/summary";
import { ActivityRankDetail, GlobalRankDetail } from "@/services/summary/summary.type";
import { getTeamDetailBatch } from "@/services/team/team";
import { TeamBasicDetail, TeamDetail } from "@/services/team/team.type";
import { getMillis } from "@/services/util";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { toast } from "sonner-native";

const dropdownData = [
  { label: "Global", value: "global", params: "global" },
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

  const defaultLogo = "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

  const [dropdownValue, setDropdownValue] = useState("global");
  const [results, setResult] = useState<GlobalRankDetail[] | ActivityRankDetail[]>([]);
  const [myTeamBest, setMyTeamBest] = useState<GlobalRankDetail | ActivityRankDetail | null>(null);
  const [myTeamLatest, setMyTeamLatest] = useState<ActivityRankDetail| null>(null);
  const [teamMap, setTeamMap] = useState<Record<string, TeamBasicDetail>>({});

  const [loading, setLoading] = useState(true);

  const calculateDisplayScore = (score: number) => {
    const num = Math.round(score * 100); 
    return `${num}%`
  }

  const fetchRanking = async (activityParam?: string) => {
    if(!activityParam) return;

    let rankings = [];
    if (activityParam === "global") {
      const res = await getGlobalRank();
      if(!res.success){
        toast.error("Failed to fetch leaderboard data");
        return;
      }
      rankings = res.rankings;
    }
    else{
      const res = await getActivityRank({activityId: activityParam});
      if(!res.success){
        toast.error("Failed to fetch leaderboard data");
        return;
      }
      rankings = res.rankings;
    }

    const top10 = rankings.slice(0,10);
    const teamIds = top10.filter(t => !teamMap[t.teamId]).map(t => t.teamId);
    
    if(teamIds.length != 0){
      const res = await getTeamDetailBatch({teamIds});
      if(!res.success){
        toast.error(res.message);
        return;
      }

      const newMap: Record<string, any> = {};
      res.teams.forEach(team => {
        newMap[team.id] = team;
      });

      setTeamMap(prev => ({
        ...prev,
        ...newMap,
      }));
    }

    setResult(top10);
    return rankings;
  };

  const fetchMyTeamBestResult = async (rankings: GlobalRankDetail[] | ActivityRankDetail[]) => {
    if(!team?.id) return;

    for (let i=0; i<rankings.length; i++){
      if(rankings[i].teamId === team.id) {
        setMyTeamBest(rankings[i]);
      }
    }
  };

  const fetchMyTeamLatestResult = async (rankings: ActivityRankDetail[]) => {
    if(!team?.id) return;

    const latestAttempt = rankings.filter(item => item.teamId === team.id)
      .reduce((latest: ActivityRankDetail | null, current: ActivityRankDetail) => {
        if (!latest) return current;

        return getMillis(current.timestamp) > getMillis(latest.timestamp)
          ? current
          : latest;
      }, null);

    setMyTeamLatest(latestAttempt);
  };

  useEffect(() => {
    const run = async () => {
      const param = dropdownData.find(item => item.value === dropdownValue)?.params;
      const activityParam = param || undefined; 

      setLoading(true);
      setMyTeamBest(null);
      setMyTeamLatest(null);
      
      const results = await fetchRanking(activityParam);
      if (results && team?.id) {
        await fetchMyTeamBestResult(results);
        if (dropdownValue !== "global") {
          await fetchMyTeamLatestResult(results as ActivityRankDetail[]);
        }
      }
    };

    run();
    setLoading(false);
  }, [dropdownValue, team?.id]);

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
            name={teamMap[results[2].teamId].name}
            score={calculateDisplayScore(results[2].score)}
            imageUrl={teamMap[results[2].teamId].logo}
            attemptNo={results[2] && "attemptNo" in results[2] ? results[2].attemptNo.toString() : undefined}
          />
        )}

        
        {top1 && (
          <View style={{ marginBottom: 30 }}>
              <PodiumCard
                rank={1}
                name={teamMap[results[0].teamId].name}
                score={calculateDisplayScore(results[0].score)}
                imageUrl={teamMap[results[0].teamId].logo}
                attemptNo={results[0] && "attemptNo" in results[0] ? results[0].attemptNo.toString() : undefined}
              />
          </View>
        )}
        
        {top2 && (
          <PodiumCard
            rank={2}
            name={teamMap[results[1].teamId].name}
            score={calculateDisplayScore(results[1].score)}
            imageUrl={teamMap[results[1].teamId].logo}
            attemptNo={results[1] && "attemptNo" in results[1] ? results[1].attemptNo.toString() : undefined}
          />
        )}
      </View>

      {/* Your ranking list below */}
      <View style={styles.rankingList}>
          {results.slice(3).map((item, i) => (
              <RankingCard 
                key={i}
                rank={item.rank.toString()}
                score={calculateDisplayScore(item.score)}
                teamName={teamMap[item.teamId].name}
                imageUrl={teamMap[item.teamId].logo}
                attemptNo={item && "attemptNo" in item ? item.attemptNo.toString() : undefined}
              />
          ))}
      </View>

      <View style={{marginTop: 10}}>
        <Text style={styles.section}>
          My Team Best:
        </Text>

        <RankingCard 
          rank={myTeamBest?.rank?.toString() || "-"}
          score={myTeamBest ? calculateDisplayScore(myTeamBest.score) : "-"}
          teamName={team?.name || "-"}
          imageUrl={team?.logo || defaultLogo}
          attemptNo={myTeamBest && "attemptNo" in myTeamBest ? myTeamBest.attemptNo.toString() : undefined}
        />
      </View>

      {dropdownValue !== "global" && 
        <View>
          <Text style={styles.section}>
            My Team Latest Attempt:
          </Text>

          <RankingCard 
            rank={myTeamLatest?.rank?.toString() || "-"}
            score={myTeamLatest ? calculateDisplayScore(myTeamLatest.score) : "-"}
            teamName={team?.name || "-"}
            imageUrl={team?.logo || defaultLogo}
            attemptNo={myTeamLatest?.attemptNo.toString()}
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
