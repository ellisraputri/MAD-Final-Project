import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import VideoPlayer from "../../ui/video-player";
import ActivityThreeSubmissionCard from "../submission/activity3-submission-card";
import Button from "../../ui/button";
import { router } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { uploadMedia } from "@/services/media/media";
import { submitResult } from "@/services/result/result";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner-native";
import { createMainActivityStyles } from "./main-activity-style";

export default function ActivityThreeScreen() {
  const theme = useAppTheme();
  const styles = createMainActivityStyles(theme);
  const { team } = useAppContext();

  const cameraRef = useRef<CameraView | null>(null);
  const [screen, setScreen] = useState<"record" | "submission">("record");

  const [videos, setVideos] = useState<
    {
      uri: string;
      bend: string;
    }[]
  >([]);

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [rerecordIndex, setRerecordIndex] = useState<number | null>(null);

  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();
  const [permissionMic, requestPermissionMic] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  if (!permissionCamera || !permissionMic) return <View />;

  if (!permissionCamera.granted || !permissionMic.granted) {
    return (
      <View>
        <Text style={styles.titleText}>
          Camera & microphone permission required
        </Text>

        {!permissionCamera.granted && (
          <Button
            onPress={requestPermissionCamera}
            width={300}
            height={53}
            fontSize={20}
            marginTop={20}
            text={`Grant Camera`}
          />
        )}

        {!permissionMic.granted && (
          <Button
            onPress={requestPermissionMic}
            width={300}
            height={53}
            fontSize={20}
            marginTop={20}
            text={`Grant Microphone`}
          />
        )}
      </View>
    );
  }

  const startRecording = async () => {
    if (!isCameraReady || recording) return;

    if (videoUri) setVideoUri(null);

    try {
      setRecording(true);

      const video = await cameraRef.current?.recordAsync({
        maxDuration: 60,
      });

      setVideoUri(video?.uri ?? null);
    } catch (e) {
      console.error("Recording failed:", e);
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  const handleConfirmSubmission = () => {
    if (!videoUri || videos.length >= 3) return;

    if (rerecordIndex !== null) {
      setVideos((prev) => {
        const updated = [...prev];
        updated[rerecordIndex] = {
          ...updated[rerecordIndex],
          uri: videoUri,
        };
        return updated;
      });
      setRerecordIndex(null);
    } else {
      if (videos.length >= 3) return;
      setVideos((prev) => [...prev, { uri: videoUri, bend: "" }]);
    }

    setVideoUri(null);
    setScreen("submission");
  };

  const handleDelete = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    alert(`Deleted submission ${index + 1}`);
  };

  const handleRerecord = (index: number) => {
    setRerecordIndex(index);
    setVideoUri(null);
    setScreen("record");
  };

  const handleFieldChange = (value: string, index: number) => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[index].bend = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!team?.id || submitLoading) return;

    const invalid = videos.some((v) => !v.bend);
    if (invalid) {
      alert("Please fill all prediction fields.");
      return;
    }

    const currLength = videos.length;
    if (currLength < 3) {
      alert(
        `You can only submit when there are 3 videos. Please continue to record ${
          3 - currLength
        } more videos.`,
      );
      return;
    }

    setSubmitLoading(true);
    const uploads = videos.map((video, index) => {
      const file = {
        uri: video.uri,
        name: `video_${index}_${Math.random()
          .toString(36)
          .substring(2, 7)}.mp4`,
        type: "video/mp4",
      };

      return uploadMedia({
        file: file,
        type: "video",
      });
    });

    const medias = await Promise.all(uploads);
    const ids = medias.map((media, _) => {
      return media.id;
    });
    const predictions = videos.map((video, _) => {
      return {
        prediction: Number(video.bend),
      };
    });

    const response = await submitResult({
      activityId: "3",
      teamId: team?.id,
      medias: ids,
      predictions: predictions,
    });
    if (!response.success) {
      toast.error(response.message);
      setSubmitLoading(false);
      return;
    }

    setSubmitLoading(false);
    Alert.alert(
      "Success",
      "Successfully submitted the videos and predictions!",
      [
        {
          text: "OK",
          onPress: () => {
            resetState();
            router.push({
              pathname: "/activity/[id]/results",
              params: { id: "3" },
            });
          },
        },
      ],
    );
  };

  const resetState = () => {
    if (recording) {
      cameraRef.current?.stopRecording();
    }

    setVideos([]);
    setVideoUri(null);
    setRecording(false);
    setRerecordIndex(null);
    setScreen("record");
    setSubmitLoading(false);
  };

  const confirmDisabled =
    !videoUri || (rerecordIndex === null && videos.length >= 3);

  return (
    <View style={styles.mainView}>
      {screen === "record" ? (
        <>
          {/* === RECORDING UI === */}
          <CameraView
            ref={cameraRef}
            style={styles.videoScreen}
            mode="video"
            onCameraReady={() => setIsCameraReady(true)}
          />

          <View style={styles.recordBtnArea}>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={styles.recordButtonOuter}
            >
              <View
                style={[
                  styles.recordButtonInner,
                  recording && styles.recordingInner,
                ]}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.titleText}>
            {rerecordIndex !== null
              ? `Re-record Submission ${rerecordIndex + 1}`
              : "Current Recording:"}
          </Text>

          {!videoUri ? (
            <Text style={styles.subtitleText}>No video available!</Text>
          ) : (
            <VideoPlayer link={videoUri} vidHeight={500} />
          )}

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => setShowModal(true)}
              width={300}
              height={53}
              fontSize={20}
              marginTop={20}
              text={`View Submissions (${videos.length}/3)`}
            />

            <Button
              onPress={handleConfirmSubmission}
              width={300}
              height={53}
              fontSize={20}
              marginTop={20}
              marginBottom={50}
              text="Confirm Submission"
              isDisabled={confirmDisabled}
            />
          </View>
        </>
      ) : (
        <>
          {/* === SUBMISSION SCREEN === */}
          <View style={{ width: "100%", alignItems: "center" }}>
            {videos.map((item, index) => (
              <ActivityThreeSubmissionCard
                key={index}
                item={index + 1}
                videoUri={item.uri}
                bend={item.bend}
                onChangeBend={(value) => handleFieldChange(value, index)}
                onDelete={() => handleDelete(index)}
                onRerecord={() =>
                  Alert.alert(
                    "Confirm Action",
                    "This will permanently remove the current progress. Are you sure you want to continue?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => handleRerecord(index),
                      },
                    ],
                  )
                }
              />
            ))}

            {videos.length < 3 && (
              <Button
                onPress={() => {
                  setRerecordIndex(null);
                  setScreen("record");
                }}
                width={260}
                fontSize={18}
                height={53}
                marginTop={20}
                text="Add Another Submission"
              />
            )}

            <Button
              onPress={handleSubmit}
              width={150}
              fontSize={18}
              marginTop={20}
              marginBottom={50}
              text="Submit"
              isLoading={submitLoading}
            />
          </View>
        </>
      )}

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <View style={styles.modalContainer}>
            <Text style={styles.titleModalText}>Your Submissions</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={35} color={theme.blackText} />
            </TouchableOpacity>

            <ScrollView
              style={{ flex: 1, width: "90%" }}
              contentContainerStyle={styles.scrollView}
            >
              {videos.length === 0 ? (
                <Text style={styles.subtitleText}>No submissions yet</Text>
              ) : (
                videos.map((item, index) => (
                  <ActivityThreeSubmissionCard
                    key={index}
                    item={index + 1}
                    videoUri={item.uri}
                    bend={item.bend}
                    onChangeBend={(value) => handleFieldChange(value, index)}
                    onDelete={() => {
                      handleDelete(index);
                      if (videos.length === 1) setShowModal(false);
                    }}
                    onRerecord={() =>
                      Alert.alert(
                        "Confirm Action",
                        "This will permanently remove the current progress. Are you sure you want to continue?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              setShowModal(false);
                              handleRerecord(index);
                            },
                          },
                        ],
                      )
                    }
                  />
                ))
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
