import React, { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AudioPlayer from "../../ui/audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ContentAudio } from "@/services/media/media.type";
import { ResultDetailActivitySeven } from "@/services/result/result.type";
import { parseMediaContent } from "@/services/media/media";
import Loading from "../../ui/loading";
import { useAppContext } from "@/context/AppContext";
import { BasePrediction } from "@/services/result/prediction.type";
import { ActivitySevenOutcome } from "@/services/result/outcome.type";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

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
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [contents, setContents] = useState<ContentAudio[][]>();
  const [predictions, setPredictions] = useState<BasePrediction[][]>();
  const [outcomes, setOutcomes] = useState<ActivitySevenOutcome[][]>();

  const setupGroupedData = async (data: ResultDetailActivitySeven) => {
    if (!team) return;

    const parsedContents = data.medias.map((m) => parseMediaContent(m.content));

    const grouped_preds: BasePrediction[][] = [];
    const grouped_outs: ActivitySevenOutcome[][] = [];
    const grouped_contents: ContentAudio[][] = [];

    for (let i = 0; i < data.predictions.length; i += team.members.length) {
      grouped_preds.push(data.predictions.slice(i, i + team.members.length));
      grouped_outs.push(
        data.outcomes.slice(
          i,
          i + team.members.length,
        ) as ActivitySevenOutcome[],
      );
    }
    for (let i = 0; i < parsedContents.length; i += team.members.length) {
      grouped_contents.push(parsedContents.slice(i, i + team.members.length));
    }

    setPredictions(grouped_preds);
    setOutcomes(grouped_outs);
    setContents(grouped_contents);
  };

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivitySeven>(
      props.resultId,
      7,
      setupGroupedData,
      true,
    );

  const isReady =
    data &&
    contents &&
    outcomes &&
    predictions &&
    outcomes.length >= 3 &&
    predictions.length >= 3 &&
    contents.length >= 3;

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="7"
      resultId={props.resultId}
      theoryKey="theory7"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
      backMarginTop={30}
    >
      {isReady &&
        [1, 2, 3].map((item, i) => (
          <ActivitySevenResultCard
            key={item}
            item={item}
            contents={contents[i]}
            valueCalculated={outcomes[i]}
            valuePredict={predictions[i]}
          />
        ))}
    </ActivityResultBaseScreen>
  );
}
