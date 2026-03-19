import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import VideoPlayer from "./video-player";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ActivityThreeSubmissionCard from "./activity3-submission-card";

export default function ActivityThreeScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [screen, setScreen] = useState<"record" | "submission">("record");
  
  const [videos, setVideos] = useState<{
    uri: string;
    bend: string;
  }[]>([]);

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [rerecordIndex, setRerecordIndex] = useState<number | null>(null);

  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();
  const [permissionMic, requestPermissionMic] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);


  if (!permissionCamera || !permissionMic) return <View />;

  if (!permissionCamera.granted || !permissionMic.granted) {
    return (
      <View>
        <Text style={styles.titleText}>Camera & microphone permission required</Text>

        {!permissionCamera.granted && (
          <TouchableOpacity onPress={requestPermissionCamera} style={styles.buttonPopup}>
            <Text style={styles.buttonText}>Grant Camera</Text>
          </TouchableOpacity>
        )}

        {!permissionMic.granted && (
          <TouchableOpacity onPress={requestPermissionMic} style={styles.buttonPopup}>
            <Text style={styles.buttonText}>Grant Microphone</Text>
          </TouchableOpacity>
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
        { uri: videoUri, bend: ""},
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

  const handleFieldChange = (value: string, index: number) => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[index].bend = value;
      return updated;
    });
  }

  const handleSubmit = () => {
    const invalid = videos.some(v => !v.bend);
    if (invalid) {
      alert("Please fill all mass and prediction fields.");
      return;
    }

    const currLength = videos.length;
    if(currLength < 3){
      alert(`You can only submit when there are 3 videos. Please continue to record ${3-currLength} more videos.`)
    }
    else{
      alert(`Successfully submitted the videos! \n ${videos[2].bend}`)
    }
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
            <TouchableOpacity
              style={styles.buttonPopup}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.buttonText}>
                View Submissions ({videos.length}/3)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonPopup,
                confirmDisabled && styles.disabledBtn,
              ]}
              onPress={handleConfirmSubmission}
              disabled={confirmDisabled}
            >
              <Text style={styles.buttonText}>Confirm Submission</Text>
            </TouchableOpacity>
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
                onRerecord={() => handleRerecord(index)}
              />
            ))}
      
            {videos.length < 3 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  setRerecordIndex(null);
                  setScreen("record");
                }}
              >
                <Text style={styles.btnText}>
                  Add Another Submission
                </Text>
              </TouchableOpacity>
            )}
      
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.modalContainer}>
          <Text style={styles.titleModalText}>Your Submissions</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="close" size={35} color="#357D89" />
          </TouchableOpacity>

          <ScrollView
            style={{ flex: 1, width: '90%' }}
            contentContainerStyle={styles.scrollView}
          >
            {videos.length === 0 ? (
              <Text>No submissions yet</Text>
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


const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
    padding: 8,
  },
  buttonPopup: {
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#388087',
    borderRadius: 50,
    paddingVertical: 8,
    alignItems: 'center',
    width: 300,
    height: 53,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 20,
    color: '#388087',
    fontWeight: '500',
    fontFamily: "Nunito_700Bold",
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
    backgroundColor: '#d9d9d9',
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
    color: '#357D89',
    fontWeight: '500',
    fontFamily: "Lato_700Bold",
  },
  titleText: {
    marginTop: 100,
    marginBottom: 20,
    fontSize: 20,
    color: '#357D89',
    fontWeight: '500',
    fontFamily: "Lato_700Bold",
  },
  subtitleText: {
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    marginBottom: 60,
  },
  backBtn: {
    padding: 10,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#388087',
    borderRadius: 50,
    paddingVertical: 8,
    alignItems: 'center',
    width: 260,
    height: 53,
  },

  btnText:{
    fontSize: 18,
    color: '#388087',
    fontWeight: '500',
    fontFamily: "Nunito_700Bold",
  },

  submitBtn: {
    marginTop: 30,
    marginBottom: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 50,
    borderColor: '#388087',
    width: 150,
    alignItems: 'center'
  },
});