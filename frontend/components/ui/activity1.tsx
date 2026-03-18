import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import VideoPlayer from "./video-player";
import ActivityOneSubmissionCard from "./activity1-submission-card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityOneScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [screen, setScreen] = useState<"record" | "submission">("record");
  const [videos, setVideos] = useState<string[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();
  const [permissionMic, requestPermissionMic] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);


  if (!permissionCamera || !permissionMic) return <View />;

  if (!permissionCamera.granted || !permissionMic.granted) {
    return (
      <View>
        <Text>Camera & microphone permission required</Text>

        {!permissionCamera.granted && (
          <TouchableOpacity onPress={requestPermissionCamera}>
            <Text>Grant Camera</Text>
          </TouchableOpacity>
        )}

        {!permissionMic.granted && (
          <TouchableOpacity onPress={requestPermissionMic}>
            <Text>Grant Microphone</Text>
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
    setVideos((prev) => [...prev, videoUri]);
    setVideoUri(null);
    setScreen("submission"); 
  };

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

          <Text style={styles.titleText}>Current Recording:</Text>

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
                (!videoUri || videos.length >= 3) && styles.disabledBtn,
              ]}
              onPress={handleConfirmSubmission}
              disabled={!videoUri || videos.length >= 3}
            >
              <Text style={styles.buttonText}>Confirm Submission</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* === SUBMISSION SCREEN === */}
            <View style={{ width: "100%", alignItems: "center" }}>
            {videos.map((uri, index) => (
              <ActivityOneSubmissionCard
                key={index}
                item={index + 1}
                videoUri={uri}
              />
            ))}
      
            {videos.length < 3 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setScreen("record")}
              >
                <Text style={styles.btnText}>
                  Add Another Submission
                </Text>
              </TouchableOpacity>
            )}
      
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.modalContainer}>
          <Text style={styles.titleModalText}>Your Sudbmissions</Text>

          <ScrollView
            style={{ flex: 1, width: '90%' }}
            contentContainerStyle={styles.scrollView}
          >
            {videos.length === 0 ? (
              <Text>No submissions yet</Text>
            ) : (
              videos.map((uri, index) => (
                <ActivityOneSubmissionCard
                  key={index}
                  item={index + 1}
                  videoUri={uri}
                  isInModal={true}
                />
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
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
    marginTop: 60,
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
    backgroundColor: 'green',
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'red'
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