import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theoryActivity from "@/data/activity_theory.json";
import Button from "./ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivitySix } from "@/services/result/result.type";
import { getResultDetail } from "@/services/result/result";
import { toast } from "sonner-native";
import Loading from "./ui/loading";
import { useAppContext } from "@/context/AppContext";
import { MediaDetail } from "@/services/media/media.type";
import RatingPopup from "./ui/rating-popup";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { getActivityRank } from "@/services/summary/summary";
import RankingCard from "./ui/ranking-card";
import { BasePrediction } from "@/services/result/prediction.type";
import { ActivityBaseOutcome } from "@/services/result/outcome.type";

const defaultLogo =
  "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

function ActivitySixResultCard(props: {
  item: number;
  timePredict: BasePrediction[];
  timeCalculated: ActivityBaseOutcome[];
  accuracyPredict?: BasePrediction[];
  accuracyCalculated?: ActivityBaseOutcome[];
  medias?: MediaDetail[];
}) {
  const theme = useAppTheme();
  const resultStyles = createStyles(theme);

  return (
    <View
      key={props.item}
      style={[resultStyles.card, { borderWidth: 1, borderColor: "white" }]}
    >
      <View style={resultStyles.titleRow}>
        <Text style={resultStyles.title}>
          {props.item === 1 && "Reaction Challenge - Dominant Hand"}
          {props.item === 2 && "Reaction Challenge - Non-Dominant Hand"}
          {props.item === 3 && "Tracing Challenge"}
        </Text>
      </View>

      {props.item === 3 && (
        <>
          {props.medias?.map((m, idx) => (
            <View key={idx}>
              <Text style={resultStyles.subtitleText}>
                Trace Result Member {idx + 1}:{" "}
              </Text>
              <View style={resultStyles.padContainer} key={idx}>
                <Image
                  source={{
                    uri: "https://coloringlib.com/wp-content/uploads/2024/01/truck-tracing-sheet-coloring.jpg",
                  }}
                  style={resultStyles.image}
                />

                <Image
                  source={{ uri: m.content }} // from Cloudinary
                  style={[resultStyles.image, resultStyles.overlay]}
                />
              </View>
            </View>
          ))}
        </>
      )}

      <Text style={resultStyles.subtitleText}>Time used</Text>
      <View style={resultStyles.list}>
        {props.timePredict.map((p, idx) => (
          <Text style={resultStyles.listItem} key={idx}>
            • Prediction from Member {idx + 1}: {p.prediction} ms
          </Text>
        ))}

        {props.timeCalculated.map((p, idx) => (
          <Text style={resultStyles.listItem} key={idx}>
            • Outcome from Member {idx + 1}: {p.outcome} ms
          </Text>
        ))}
      </View>

      {props.item === 3 && (
        <>
          <Text style={resultStyles.subtitleText}>Accuracy</Text>
          <View style={resultStyles.list}>
            {props.accuracyPredict &&
              props.accuracyPredict.map((p, idx) => (
                <Text style={resultStyles.listItem} key={idx}>
                  • Prediction from Member {idx + 1}: {p.prediction}%
                </Text>
              ))}

            {props.accuracyCalculated &&
              props.accuracyCalculated.map((p, idx) => (
                <Text style={resultStyles.listItem} key={idx}>
                  • Outcome from Member {idx + 1}: {p.outcome}%
                </Text>
              ))}
          </View>
        </>
      )}
    </View>
  );
}

export default function ActivitySixResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [data, setData] = useState<ResultDetailActivitySix>();
  const [predictions, setPredictions] = useState<BasePrediction[][]>();
  const [outcomes, setOutcomes] = useState<ActivityBaseOutcome[][]>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [result, setResult] = useState<ActivityRankDetail>();

  const fetchDetail = async () => {
    if (!team) return;
    setLoading(true);

    const response = await getResultDetail({ resultId: props.resultId });
    if (!response.success || response.data === null) {
      toast.error(response.message);
      setLoading(false);
      return;
    }
    if (Number(response.data.activityId) !== 6) {
      console.warn(
        "[ActivitySix] Wrong activityId received, skipping render. Got:",
        response.data.activityId,
      );
      return;
    }
    if (!response.data?.ratings) setShowRating(true);
    setData(response.data as ResultDetailActivitySix);

    const grouped_preds = [];
    const grouped_outs = [];

    for (
      let i = 0;
      i < response.data.predictions.length;
      i += team?.members.length
    ) {
      grouped_preds.push(
        response.data.predictions.slice(i, i + team.members.length),
      );
      grouped_outs.push(
        response.data.outcomes.slice(i, i + team.members.length),
      );
    }
    setPredictions(grouped_preds);
    setOutcomes(grouped_outs as ActivityBaseOutcome[][]);

    const rankingRes = await getActivityRank({ activityId: "6" });
    if (!rankingRes.success) {
      toast.error(
        `Failed to fetch leaderboard rank data: ${rankingRes.message}`,
      );
    }
    for (let i = 0; i < rankingRes.rankings.length; i++) {
      if (rankingRes.rankings[i].resultId === props.resultId) {
        setResult(rankingRes.rankings[i]);
        break;
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      >
        {/* Theory */}
        <Section title="Theory">
          <Text style={[styles.paragraph, { marginBottom: 30 }]}>
            {theoryActivity["theory6"]}
          </Text>
        </Section>

        {/* Results */}
        {data && predictions && outcomes && (
          <Section title="Results">
            <ActivitySixResultCard
              item={1}
              key={1}
              timePredict={predictions[0]}
              timeCalculated={outcomes[0]}
            />
            <ActivitySixResultCard
              item={2}
              key={2}
              timePredict={predictions[1]}
              timeCalculated={outcomes[1]}
            />
            <ActivitySixResultCard
              item={3}
              medias={data.medias}
              key={3}
              timePredict={predictions[2]}
              timeCalculated={outcomes[2]}
              accuracyPredict={predictions[3]}
              accuracyCalculated={outcomes[3]}
            />
          </Section>
        )}

        <Section title="Leaderboard Rank">
          {result === undefined ? (
            <Text style={styles.paragraph}>
              Still compiling leaderboard data. Please wait until tomorrow.
            </Text>
          ) : (
            <RankingCard
              rank={result.rank?.toString() || "-"}
              score={result ? `${Math.round(result.score * 100)}%` : "-"}
              teamName={team?.name || "-"}
              imageUrl={team?.logo || defaultLogo}
              attemptNo={result.attemptNo.toString()}
            />
          )}
        </Section>

        <Button
          width={250}
          onPress={props.onBack}
          fontSize={20}
          marginTop={5}
          text="Back"
        />
      </ScrollView>
      {data?.resultId && (
        <RatingPopup
          activityId={"6"}
          resultId={data?.resultId}
          showModal={showRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
  );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 5,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      fontFamily: "Lato_700Bold",
    },

    divider: {
      height: 2,
      backgroundColor: theme.text,
      marginVertical: 10,
    },

    paragraph: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "justify",
      color: theme.blackText,
      fontFamily: "Lato_400Regular",
    },

    subsContainer: {
      marginLeft: 20,
    },
    titleRow: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    card: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 20,
      marginBottom: 30,
      elevation: 3,
    },
    title: {
      marginBottom: 10,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 20,
    },
    prediction: {
      marginTop: 15,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 18,
    },
    subtitleText: {
      marginTop: 10,
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: theme.blackText,
    },
    descText: {
      marginTop: 10,
      fontFamily: "Lato_400Regular",
      fontSize: 15,
      color: theme.blackText,
    },
    list: {
      marginLeft: 10,
      marginTop: 4,
    },
    listItem: {
      fontSize: 15,
      fontFamily: "Lato_400Regular",
      marginBottom: 5,
      color: theme.blackText,
    },
    padContainer: {
      width: 300,
      height: 200,
    },
    image: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    overlay: {
      zIndex: 200,
    },
  });

  return styles;
};
