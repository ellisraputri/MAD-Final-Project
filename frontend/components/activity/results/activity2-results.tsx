import React, { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AudioPlayer from "../../ui/audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityTwo } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import { ContentAudio } from "@/services/media/media.type";
import { parseMediaContent } from "@/services/media/media";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

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
          • Predicted: {props.valuePredict?.toFixed(3)}
        </Text>
        <Text style={resultStyles.listItem}>
          • Outcome: {props.valueCalculated?.toFixed(3)}
        </Text>
      </View>

      <Text style={resultStyles.descText}>
        The value of dB for this result is {props.realOutcome?.toFixed(3)}
      </Text>
    </View>
  );
}

export default function ActivityTwoResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const { id } = useLocalSearchParams();

  const [contents, setContents] = useState<ContentAudio[]>();

  const setupContents = async (data: ResultDetailActivityTwo) => {
    const parsedContents = data.medias.map((m) => parseMediaContent(m.content));
    setContents(parsedContents);
  };

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivityTwo>(
      props.resultId,
      2,
      setupContents
    );

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="2"
      resultId={props.resultId}
      theoryKey="theory2"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
    >
      {contents && data && (
        <>
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
        </>
      )}
    </ActivityResultBaseScreen>
  );
}
