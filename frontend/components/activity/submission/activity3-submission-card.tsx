import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";
import VideoModal from "../../ui/video-modal";

export default function ActivityThreeSubmissionCard(props: {
  item: number;
  videoUri: string | null;
  bend: string;
  onChangeBend: (text: string) => void;
  onDelete: () => void;
  onRerecord: () => void;
}) {
  const theme = useAppTheme();
  const submissionStyles = createStyles(theme);

  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <View key={props.item} style={submissionStyles.card}>
      <View style={submissionStyles.titleRow}>
        <Text style={submissionStyles.title}>
          {props.item}. Submission {props.item}
        </Text>

        <TouchableOpacity onPress={props.onDelete}>
          <Ionicons name="trash-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={submissionStyles.subsContainer}>
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

        <TouchableOpacity
          style={submissionStyles.editBtn}
          onPress={props.onRerecord}
        >
          <Text style={submissionStyles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const createStyles = (theme: any) => {
  const submissionStyles = StyleSheet.create({
    subsContainer: {
      marginLeft: 20,
    },
    titleRow: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    card: {
      width: "90%",
      backgroundColor: theme.background,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.isDark ? theme.blackText : "transparent",
      borderRadius: 10,
      padding: 25,
      marginBottom: 40,
      elevation: 3,
    },
    title: {
      marginBottom: 20,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 20,
    },
    videoPlaceholder: {
      height: 400,
      width: "100%",
      borderWidth: 2,
      borderColor: theme.text,
      backgroundColor: theme.hoverBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      overflow: "hidden",
    },
    prediction: {
      marginTop: 15,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 18,
    },
    descText: {
      marginTop: 10,
      fontFamily: "Lato_400Regular",
      color: theme.text,
      fontSize: 15,
    },
    inputBox: {
      borderWidth: 0.8,
      height: 40,
      marginVertical: 10,
      marginBottom: 20,
      borderColor: theme.blackText,
      color: theme.blackText,
    },
    editBtn: {
      backgroundColor: theme.text,
      padding: 8,
      borderRadius: 6,
      alignItems: "center",
      alignSelf: "flex-end",
      width: 80,
      height: 40,
      justifyContent: "center",
      marginTop: 10,
    },
    editBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
    },
  });
  return submissionStyles;
};
