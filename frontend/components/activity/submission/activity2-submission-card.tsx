import { Text, TextInput } from "react-native";
import AudioPlayer from "../../ui/audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import SubmissionCardLayout from "./submission-card-layout";
import { createSubmissionCardStyles } from "./submissionCardStyle";

export default function ActivityTwoSubmissionCard(props: {
  item: number;
  uri: string | null;
  levels: Array<number>;
  input: string;
  onChangeInput: (text: string) => void;
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
      {props.uri ? (
        <AudioPlayer uri={props.uri} levels={props.levels} />
      ) : (
        <Text style={submissionStyles.descText}>No audio</Text>
      )}

      <Text style={submissionStyles.prediction}>Prediction</Text>

      <Text style={submissionStyles.descText}>
        Order of Loudness (among all submissions)
      </Text>
      <TextInput
        style={[
          submissionStyles.inputBox,
          theme.isDark && { borderWidth: 1, borderColor: "white" },
        ]}
        value={props.input}
        onChangeText={props.onChangeInput}
        keyboardType="numeric"
      />
    </SubmissionCardLayout>
  );
}
