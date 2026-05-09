import ActivityOneResultsScreen from "@/components/activity/results/activity1-results";
import ActivityTwoResultsScreen from "@/components/activity/results/activity2-results";
import ActivityThreeResultsScreen from "@/components/activity/results/activity3-results";
import ActivityFourResultsScreen from "@/components/activity/results/activity4-results";
import ActivityFiveResultsScreen from "@/components/activity/results/activity5-results";
import ActivitySixResultsScreen from "@/components/activity/results/activity6-results";
import ActivitySevenResultsScreen from "@/components/activity/results/activity7-results";
import Loading from "@/components/ui/loading";
import ResultCard from "@/components/ui/result-card";
import { useAppContext } from "@/context/AppContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getResultList } from "@/services/result/result";
import { ResultList } from "@/services/result/result.type";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export default function ExplanationScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { team } = useAppContext();

  const { id } = useGlobalSearchParams();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [resultId, setResultId] = useState<string>();
  const [results, setResults] = useState<ResultList[]>([]);
  const [loading, setLoading] = useState(true);

  const onPressCard = (resId: string) => {
    setResultId(resId);
    setDetailsVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      setDetailsVisible(false);
      setLoading(true);
      setResults([]); // ← reset before fetching

      if (!team?.id || typeof id !== "string") {
        setLoading(false);
        return;
      }

      const load = async () => {
        const response = await getResultList({
          teamId: team.id,
          activityId: id,
        });

        if (!response.success) {
          toast.error(response.message);
          setLoading(false);
          return;
        }
        setResults(response.data ?? []);
        setLoading(false);
      };

      load();
    }, [team?.id, id]),
  );

  if (loading) return <Loading />;

  return (
    <ScrollView style={styles.container}>
      {!detailsVisible && (
        <View>
          <Text style={styles.titleText}>Attempts</Text>
          <View
            style={{
              height: 1,
              backgroundColor: theme.blackText,
              marginVertical: 10,
            }}
          />

          <View style={{ marginTop: 10 }}>
            {results.length === 0 && (
              <Text style={{ color: theme.blackText }}>No attempt yet</Text>
            )}
            {results.length > 0 &&
              results.map((item, index) => (
                <ResultCard
                  key={index}
                  index={item.attempt}
                  score={item.score * 100}
                  onPress={() => onPressCard(item.resultId)}
                />
              ))}
          </View>
        </View>
      )}

      {detailsVisible && Number(id) === 1 && (
        <ActivityOneResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 2 && (
        <ActivityTwoResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 3 && (
        <ActivityThreeResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 4 && (
        <ActivityFourResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 5 && (
        <ActivityFiveResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 6 && (
        <ActivitySixResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}

      {detailsVisible && Number(id) === 7 && (
        <ActivitySevenResultsScreen
          resultId={resultId ?? ""}
          onBack={() => setDetailsVisible(false)}
        />
      )}
    </ScrollView>
  );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 30,
    },
    titleText: {
      marginTop: 30,
      textAlign: "center",
      fontFamily: "Lato_700Bold",
      fontSize: 20,
      color: theme.blackText,
    },
  });
  return styles;
};
