import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";
import VideoModal from "../../ui/video-modal";
import SubmissionCardLayout from "./submission-card-layout";
import { createSubmissionCardStyles } from "./submissionCardStyle";

export default function ActivityOneSubmissionCard(props: {
  item: number;
  videoUri: string | null;
  mass: string;
  time: string;
  onChangeMass: (text: string) => void;
  onChangeTime: (text: string) => void;
  onDelete: () => void;
  onRerecord: () => void;
}) {
  const theme = useAppTheme();
  const submissionStyles = createSubmissionCardStyles(theme);

  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <SubmissionCardLayout
      item={props.item}
      onDelete={props.onDelete}
      onRerecord={props.onRerecord}
    >
      <View style={submissionStyles.videoPlaceholder}>
        {props.videoUri ? (
          <VideoModal
            showModal={showVideoModal}
            videoUri={props.videoUri}
            openModal={() => setShowVideoModal(true)}
            closeModal={() => setShowVideoModal(false)}
          />
        ) : (
          <Text style={submissionStyles.descText}>No video</Text>
        )}
      </View>

      <Text style={submissionStyles.descText}>Mass of toy (gram)</Text>
      <TextInput
        style={submissionStyles.inputBox}
        value={props.mass}
        onChangeText={props.onChangeMass}
        keyboardType="numeric"
      />

      <Text style={submissionStyles.prediction}>Prediction</Text>

      <Text style={submissionStyles.descText}>
        Time to hit ground (seconds)
      </Text>
      <TextInput
        style={submissionStyles.inputBox}
        value={props.time}
        onChangeText={props.onChangeTime}
        keyboardType="numeric"
      />
    </SubmissionCardLayout>
  );
}
