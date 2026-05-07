import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theoryActivity from "@/data/activity_theory.json";
import Button from "../../ui/button";
import AudioPlayer from "../../ui/audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ContentAudio } from "@/services/media/media.type";
import { ResultDetailActivitySeven } from "@/services/result/result.type";
import { getResultDetail } from "@/services/result/result";
import { toast } from "sonner-native";
import { parseMediaContent } from "@/services/media/media";
import Loading from "../../ui/loading";
import { useAppContext } from "@/context/AppContext";
import RatingPopup from "../../ui/rating-popup";
import RankingCard from "../../ui/ranking-card";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { getActivityRank } from "@/services/summary/summary";
import { BasePrediction } from "@/services/result/prediction.type";
import { ActivitySevenOutcome } from "@/services/result/outcome.type";
import { createResultStyles } from "./activity-result-style";
import ResultSection from "./activity-result-section";

const defaultLogo =
  "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

function ActivitySevenResultCard(props: {
  item: number;
  contents: any[];
  valuePredict: BasePrediction[];
  valueCalculated: ActivitySevenOutcome[];
}) {
  const theme = useAppTheme();
  const resultStyles = createResultStyles(theme);

  return (
    <View
      key={props.item}
      style={[resultStyles.card, { borderWidth: 1, borderColor: "white" }]}
    >
      <View style={resultStyles.titleRow}>
        <Text style={resultStyles.title}>
          {props.item}. Submission {props.item}
        </Text>
      </View>

      <View style={resultStyles.subsContainer}>
        {props.contents?.map((content, idx) => (
          <View key={idx} style={resultStyles.viewAudio}>
            <Text style={resultStyles.subtitle2Text}>
              Audio from Member {idx + 1}
            </Text>
            {content.url ? (
              <AudioPlayer uri={content.url} levels={content.levels} />
            ) : (
              <Text style={resultStyles.descText}>No audio</Text>
            )}
          </View>
        ))}
      </View>

      <Text style={resultStyles.subtitleText}>Breath per minute</Text>
      <View style={resultStyles.list}>
        {props.valuePredict.map((p, idx) => (
          <Text style={resultStyles.listItem} key={idx}>
            • Prediction from Member {idx + 1}:{" "}
            {p.prediction ? p.prediction.toFixed(3) : "-"} bpm
          </Text>
        ))}

        {props.valueCalculated.map((p, idx) => (
          <Text style={resultStyles.listItem} key={idx}>
            • Outcome from Member {idx + 1}: {p.bpm ? p.bpm.toFixed(3) : "-"}{" "}
            bpm
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function ActivitySevenResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createResultStyles(theme);
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [data, setData] = useState<ResultDetailActivitySeven>();
  const [contents, setContents] = useState<ContentAudio[][]>();
  const [predictions, setPredictions] = useState<BasePrediction[][]>();
  const [outcomes, setOutcomes] = useState<ActivitySevenOutcome[][]>();
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
    if (Number(response.data.activityId) !== 7) {
      console.warn(
        "[ActivitySeven] Wrong activityId received, skipping render. Got:",
        response.data.activityId
      );
      return;
    }

    const parsedContents = response.data.medias.map((m, _) => {
      return parseMediaContent(m.content);
    });

    const grouped_preds = [];
    const grouped_outs = [];
    const grouped_contents = [];

    for (
      let i = 0;
      i < response.data.predictions.length;
      i += team?.members.length
    ) {
      grouped_preds.push(
        response.data.predictions.slice(i, i + team.members.length)
      );
      grouped_outs.push(
        response.data.outcomes.slice(i, i + team.members.length)
      );
    }
    setPredictions(grouped_preds);
    setOutcomes(grouped_outs as ActivitySevenOutcome[][]);

    for (let i = 0; i < parsedContents.length; i += team?.members.length) {
      grouped_contents.push(parsedContents.slice(i, i + team.members.length));
    }
    setContents(grouped_contents);

    if (!response.data?.ratings) setShowRating(true);
    setData(response.data as ResultDetailActivitySeven);

    const rankingRes = await getActivityRank({ activityId: "7" });
    if (!rankingRes.success) {
      toast.error(
        `Failed to fetch leaderboard rank data: ${rankingRes.message}`
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
        <ResultSection title="Theory">
          <Text style={[styles.paragraph, { marginBottom: 30 }]}>
            {theoryActivity["theory7"]}
          </Text>
        </ResultSection>

        {/* Results */}
        {data &&
          contents &&
          outcomes &&
          predictions &&
          outcomes.length >= 3 &&
          predictions.length >= 3 &&
          contents.length >= 3 && (
            <ResultSection title="Results">
              <ActivitySevenResultCard
                item={1}
                contents={contents[0]}
                valueCalculated={outcomes[0]}
                valuePredict={predictions[0]}
              />
              <ActivitySevenResultCard
                item={2}
                contents={contents[1]}
                valueCalculated={outcomes[1]}
                valuePredict={predictions[1]}
              />
              <ActivitySevenResultCard
                item={3}
                contents={contents[2]}
                valueCalculated={outcomes[2]}
                valuePredict={predictions[2]}
              />
            </ResultSection>
          )}

        <ResultSection title="Leaderboard Rank">
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
        </ResultSection>

        <Button
          width={250}
          onPress={props.onBack}
          fontSize={20}
          marginTop={30}
          text="Back"
        />
      </ScrollView>
      {data?.resultId && (
        <RatingPopup
          activityId={"7"}
          resultId={data?.resultId}
          showModal={showRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
  );
}
