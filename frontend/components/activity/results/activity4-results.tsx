import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityFour } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

function ActivityFourResultCard(props: {
  item: number;
  vibrateTime: number;
  valuePredict: number;
  valueCalculated: number;
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
          Vibration {props.item}:{" "}
          {props.vibrateTime ? props.vibrateTime.toFixed(3) : "NaN"}s
        </Text>
      </View>

      <View style={resultStyles.list}>
        <Text style={resultStyles.listItem}>
          • Predicted:{" "}
          {props.valuePredict ? props.valuePredict.toFixed(3) : "-"} cm
        </Text>
        <Text style={resultStyles.listItem}>
          • Outcome:{" "}
          {props.valueCalculated ? props.valueCalculated.toFixed(3) : "-"} cm
        </Text>
      </View>
    </View>
  );
}

export default function ActivityFourResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const { id } = useLocalSearchParams();

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivityFour>(props.resultId, 4);

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="4"
      resultId={props.resultId}
      theoryKey="theory4"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
    >
      {data && (
        <>
          {data?.outcomes?.map((outcome, index) => (
            <ActivityFourResultCard
              key={index}
              item={index + 1}
              vibrateTime={Number(data.medias?.[index]?.content)}
              valueCalculated={outcome.outcome}
              valuePredict={data.predictions?.[index]?.prediction}
            />
          ))}
        </>
      )}
    </ActivityResultBaseScreen>
  );
}
