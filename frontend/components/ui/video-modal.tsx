import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import VideoPlayer from "./video-player";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useState } from "react";

type VideoModalProps = {
  showModal: boolean;
  videoUri: string;
  openModal: () => void;
  closeModal: () => void;
};

export default function VideoModal({
  showModal,
  videoUri,
  openModal,
  closeModal,
}: VideoModalProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [rate, setRate] = useState(1.0);

  const toggleSlowMotion = () => {
    setRate((prev) => (prev === 1 ? 0.5 : 1));
  };

  return (
    <>
      <TouchableOpacity style={styles.playOverlay} onPress={openModal}>
        <Ionicons name="play-circle" size={60} color={theme.text} />
        <Text style={styles.tapText}>Tap to play</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={false}>
        <View style={styles.fullscreenModal}>
          <View style={styles.centerContent}>
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.slowMoBtn}
                onPress={toggleSlowMotion}
              >
                <Text style={styles.btnText}>
                  {rate === 1 ? "0.5x Slow Motion" : "Normal Speed"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.helperText}>
                You can also adjust playback speed using the settings in native
                video controls.
              </Text>
            </View>

            <VideoPlayer
              link={videoUri}
              rate={rate}
              vidHeight={400}
              vidWidth={320}
            />
          </View>

          <TouchableOpacity style={styles.closeVideoBtn} onPress={closeModal}>
            <Text style={styles.editBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    playOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    tapText: {
      marginTop: 8,
      color: theme.text,
      fontFamily: "Lato_400Regular",
      fontSize: 20,
    },
    fullscreenModal: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 80,
    },
    centerContent: {
      alignItems: "center",
    },
    closeVideoBtn: {
      marginTop: 50,
      backgroundColor: theme.text,
      padding: 10,
      borderRadius: 8,
      width: 120,
      alignItems: "center",
    },
    editBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
    },
    controlsContainer: {
      width: "100%",
      alignItems: "center",
      gap: 12,
    },
    slowMoBtn: {
      backgroundColor: theme.text,
      padding: 10,
      marginTop: 50,
      borderRadius: 8,
      width: 180,
      alignItems: "center",
    },
    helperText: {
      color: "#aaa",
      fontSize: 12,
      textAlign: "center",
      paddingHorizontal: 20,
      marginTop: 10,
    },
    btnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
    },
  });
  return styles;
};
