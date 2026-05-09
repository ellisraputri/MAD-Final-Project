import { useAppTheme } from "@/hooks/use-app-theme";
import { Text, TextInput } from "react-native";
import SubmissionCardLayout from "./submission-card-layout";
import { createSubmissionCardStyles } from "./submission-card-style";

export default function ActivityFiveSubmissionCard(props: {
  item: number;
  duration: string | null;
  movement: string;
  onChangeMovement: (text: string) => void;
  onDelete: () => void;
  onRerecord: () => void;
}) {
  const theme = useAppTheme();
  const submissionStyles = createSubmissionCardStyles(theme);

  return (
    <SubmissionCardLayout
      item={props.item}
      onDelete={props.onDelete}
      onRerecord={props.onRerecord}
    >
      <Text style={submissionStyles.descText}>
        Vibration time: {props.duration} seconds
      </Text>

      <Text style={submissionStyles.prediction}>Prediction</Text>
      <Text style={submissionStyles.descText}>Phone vibration sensor (cm)</Text>
      <TextInput
        style={submissionStyles.inputBox}
        value={props.movement}
        onChangeText={props.onChangeMovement}
        keyboardType="numeric"
      />
    </SubmissionCardLayout>
  );
}
