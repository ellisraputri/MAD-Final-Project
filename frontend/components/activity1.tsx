import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import VideoPlayer from "./ui/video-player";
import ActivityOneSubmissionCard from "./ui/activity1-submission-card";
import Button from "./ui/button";
import { router } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { uploadMedia } from "@/services/media/media";
import { submitResult } from "@/services/result/result";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner-native";

export default function ActivityOneScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {team} = useAppContext();

  const cameraRef = useRef<CameraView | null>(null);
  const [screen, setScreen] = useState<"record" | "submission">("record");
  
  const [videos, setVideos] = useState<{
    uri: string;
    mass: string;
    time: string;
  }[]>([]);

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
        <Text style={styles.titleText}>Camera & microphone permission required</Text>

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
    } 
    else {
      if (videos.length >= 3) return;
      setVideos((prev) => [
        ...prev,
        { uri: videoUri, mass: "", time: "" },
      ]);
    }

    setVideoUri(null);
    setScreen("submission");
  };

  const handleDelete = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    alert(`Deleted submission ${index+1}`)
  };

  const handleRerecord = (index: number) => {
    setRerecordIndex(index);
    setVideoUri(null);
    setScreen("record");
  };

  const handleFieldChange = (value: string, index: number, type: string) => {
    setVideos((prev) => {
      const updated = [...prev];
      if(type === 'mass') updated[index].mass = value;
      else if(type === 'time') updated[index].time = value;
      return updated;
    });
  }

  const handleSubmit = async() => {
    if(!team?.id || submitLoading) return;

    const invalid = videos.some(v => !v.mass || !v.time);
    if (invalid) {
      alert("Please fill all mass and prediction fields.");
      return;
    }

    const currLength = videos.length;
    if(currLength < 3){
      alert(`You can only submit when there are 3 videos. Please continue to record ${3-currLength} more videos.`)
      return;
    }

    setSubmitLoading(true);

    const uploads = videos.map((video, index) => {
      const file = {
        uri: video.uri,
        name: `video_${index}_${Math.random().toString(36).substring(2, 7)}.mp4`,
        type: "video/mp4",
      };

      return uploadMedia({
        file: file,
        type: "video"
      });
    });

    const medias = await Promise.all(uploads);
    const urls = medias.map((media,_) => {
      return media.id
    })
    const predictions = videos.map((video, _) => {
      return {
        mass: video.mass,
        prediction: video.time,
      }
    })

    const response = await submitResult({
      activityId: "1", 
      teamId: team?.id, 
      medias: urls, 
      predictions: predictions
    })
    if(!response.success){
      toast.error(response.message);
      setSubmitLoading(false);
      return;
    }

    setSubmitLoading(false);
    alert("Successfully submitted the videos and predictions!");
    router.push("/activity/[id]/results")
  }

  const confirmDisabled = !videoUri || (rerecordIndex === null && videos.length >= 3);

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
              <ActivityOneSubmissionCard
                key={index}
                item={index + 1}
                videoUri={item.uri}
                mass={item.mass}
                time={item.time}
                onChangeMass={(value) => handleFieldChange(value, index, 'mass')}
                onChangeTime={(value) => handleFieldChange(value, index, 'time')}
                onDelete={() => handleDelete(index)}
                onRerecord={() => handleRerecord(index)}
              />
            ))}
      
            {videos.length < 3 && (
              <Button 
                onPress={() => {
                  setRerecordIndex(null);
                  setScreen("record");
                }} 
                width={260} fontSize={18} height={53}
                marginTop={20} text="Add Another Submission"/>
            )}

            <Button onPress={handleSubmit} width={150} fontSize={18} 
              marginTop={20} marginBottom={50} text="Submit" isLoading={submitLoading}/>
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
            style={{ flex: 1, width: '90%' }}
            contentContainerStyle={styles.scrollView}
          >
            {videos.length === 0 ? (
              <Text style={styles.subtitleText}>No submissions yet</Text>
            ) : (
              videos.map((item, index) => (
                <ActivityOneSubmissionCard
                  key={index}
                  item={index + 1}
                  videoUri={item.uri}
                  mass={item.mass}
                  time={item.time}
                  onChangeMass={(value) => handleFieldChange(value, index, 'mass')}
                  onChangeTime={(value) => handleFieldChange(value, index, 'time')}
                  onDelete={() => {
                    handleDelete(index);
                    if (videos.length === 1) setShowModal(false);
                  }}
                  onRerecord={() => {
                    setShowModal(false);
                    handleRerecord(index);
                  }}
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

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 15,
      zIndex: 10,
      padding: 8,
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: 40,
    },

    recordButtonOuter: {
      width: 60,
      height: 60,
      borderRadius: 40,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },

    recordButtonInner: {
      width: 35,
      height: 35,
      borderRadius: 25,
      backgroundColor: "#c50000",
    },

    recordingInner: {
      width: 25,
      height: 25,
      borderRadius: 6, 
      backgroundColor: "#c50000",
    },

    recordBtnArea:{
      backgroundColor: theme.hoverBackground,
      width: 320,
      alignItems: 'center',
      paddingBottom: 15
    },

    videoScreen: { 
      width: 320, 
      height: 500 
    },

    mainView: { 
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center" 
    }, 

    modalContainer: {
      flex: 1,
      paddingTop: 30,
      paddingHorizontal: 5,
      alignItems: "center",
      justifyContent: 'flex-start',
    },
    scrollView: {
      alignItems: 'center',
      paddingBottom: 40,
    },
    titleModalText: {
      marginTop: 20,
      marginBottom: 20,
      fontSize: 20,
      color: theme.text,
      fontWeight: '500',
      fontFamily: "Lato_700Bold",
    },
    titleText: {
      marginTop: 100,
      marginBottom: 20,
      fontSize: 20,
      color: theme.text,
      fontWeight: '500',
      fontFamily: "Lato_700Bold",
    },
    subtitleText: {
      fontFamily: "Lato_400Regular",
      fontSize: 16,
      marginBottom: 60,
      color: theme.blackText
    },
  });
  return styles;
}