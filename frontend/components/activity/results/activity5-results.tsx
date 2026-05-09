import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityFive } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

function ActivityFiveResultCard(props: {
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

export default function ActivityFiveResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const { id } = useLocalSearchParams();

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivityFive>(props.resultId, 5);

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="5"
      resultId={props.resultId}
      theoryKey="theory5"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
    >
      {data && (
        <>
          {data?.outcomes?.map((outcome, index) => (
            <ActivityFiveResultCard
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
