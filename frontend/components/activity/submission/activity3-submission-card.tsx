import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";
import VideoModal from "../../ui/video-modal";
import SubmissionCardLayout from "./submission-card-layout";
import { createSubmissionCardStyles } from "./submission-card-style";

export default function ActivityThreeSubmissionCard(props: {
  item: number;
  videoUri: string | null;
  bend: string;
  onChangeBend: (text: string) => void;
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

      <Text style={submissionStyles.prediction}>Prediction</Text>

      <Text style={submissionStyles.descText}>Bend (degrees)</Text>
      <TextInput
        style={submissionStyles.inputBox}
        value={props.bend}
        onChangeText={props.onChangeBend}
        keyboardType="numeric"
      />
    </SubmissionCardLayout>
  );
}
