import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theoryActivity from "@/data/activity_theory.json";
import Button from "../../ui/button";
import AudioPlayer from "../../ui/audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityTwo } from "@/services/result/result.type";
import { getResultDetail } from "@/services/result/result";
import { toast } from "sonner-native";
import Loading from "../../ui/loading";
import { ContentAudio } from "@/services/media/media.type";
import { parseMediaContent } from "@/services/media/media";
import RatingPopup from "../../ui/rating-popup";
import { getActivityRank } from "@/services/summary/summary";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { useAppContext } from "@/context/AppContext";
import RankingCard from "../../ui/ranking-card";
import { createResultStyles } from "./activity-result-style";
import ResultSection from "./activity-result-section";

const defaultLogo =
  "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

function ActivityTwoResultCard(props: {
  item: number;
  audioUri: string | null;
  levels: number[];
  valuePredict: number;
  valueCalculated: number;
  realOutcome: number;
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
        {props.audioUri ? (
          <AudioPlayer uri={props.audioUri} levels={props.levels} />
        ) : (
          <Text style={resultStyles.descText}>No audio</Text>
        )}
      </View>

      <Text style={resultStyles.subtitleText}>
        Order of Loudness (among all submissions)
      </Text>
      <View style={resultStyles.list}>
        <Text style={resultStyles.listItem}>
          • Predicted: {props.valuePredict}
        </Text>
        <Text style={resultStyles.listItem}>
          • Outcome: {props.valueCalculated}
        </Text>
      </View>

      <Text style={resultStyles.descText}>
        The value of dB for this result is {props.realOutcome}
      </Text>
    </View>
  );
}

export default function ActivityTwoResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createResultStyles(theme);
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [data, setData] = useState<ResultDetailActivityTwo>();
  const [contents, setContents] = useState<ContentAudio[]>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [result, setResult] = useState<ActivityRankDetail>();

  const fetchDetail = async () => {
    setLoading(true);

    const response = await getResultDetail({ resultId: props.resultId });
    if (!response.success || response.data === null) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    if (Number(response.data.activityId) !== 2) {
      console.warn(
        "[ActivityTwo] Wrong activityId received, skipping render. Got:",
        response.data.activityId
      );
      return;
    }

    const contents = response.data.medias.map((m, _) => {
      return parseMediaContent(m.content);
    });

    setContents(contents);
    setData(response.data as ResultDetailActivityTwo);
    if (!response.data?.ratings) setShowRating(true);

    const rankingRes = await getActivityRank({ activityId: "2" });
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
            {theoryActivity["theory2"]}
          </Text>
        </ResultSection>

        {/* Results */}
        {contents && data && (
          <ResultSection title="Results">
            {data?.outcomes?.map((outcome, index) => (
              <ActivityTwoResultCard
                key={index}
                item={index + 1}
                audioUri={contents[index].url}
                levels={contents[index].levels}
                valueCalculated={outcome.outcome}
                realOutcome={outcome.realOutcome}
                valuePredict={data.predictions?.[index]?.prediction}
              />
            ))}
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
          marginTop={5}
          text="Back"
        />
      </ScrollView>

      {data?.resultId && (
        <RatingPopup
          activityId={"2"}
          resultId={data?.resultId}
          showModal={showRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
  );
}
