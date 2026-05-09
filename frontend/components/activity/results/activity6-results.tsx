import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivitySix } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import { useAppContext } from "@/context/AppContext";
import { MediaDetail } from "@/services/media/media.type";
import { BasePrediction } from "@/services/result/prediction.type";
import { ActivityBaseOutcome } from "@/services/result/outcome.type";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

function ActivitySixResultCard(props: {
  item: number;
  timePredict: BasePrediction[];
  timeCalculated: ActivityBaseOutcome[];
  accuracyPredict?: BasePrediction[];
  accuracyCalculated?: ActivityBaseOutcome[];
  medias?: MediaDetail[];
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
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [predictions, setPredictions] = useState<BasePrediction[][]>();
  const [outcomes, setOutcomes] = useState<ActivityBaseOutcome[][]>();

  const setupGroupedData = async (data: ResultDetailActivitySix) => {
    if (!team) return;

    const grouped_preds: BasePrediction[][] = [];
    const grouped_outs: ActivityBaseOutcome[][] = [];

    for (let i = 0; i < data.predictions.length; i += team.members.length) {
      grouped_preds.push(data.predictions.slice(i, i + team.members.length));
      grouped_outs.push(
        data.outcomes.slice(
          i,
          i + team.members.length,
        ) as ActivityBaseOutcome[],
      );
    }

    setPredictions(grouped_preds);
    setOutcomes(grouped_outs);
  };

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivitySix>(
      props.resultId,
      6,
      setupGroupedData,
      true,
    );

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="6"
      resultId={props.resultId}
      theoryKey="theory6"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
    >
      {data && predictions && outcomes && (
        <>
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
        </>
      )}
    </ActivityResultBaseScreen>
  );
}
