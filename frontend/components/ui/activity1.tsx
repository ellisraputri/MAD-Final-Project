import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import VideoPlayer from "./video-player";
import ActivityOneSubmissionCard from "./activity1-submission-card";

export default function ActivityOneScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [screen, setScreen] = useState<"record" | "submission">("record");

  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();
  const [permissionMic, requestPermissionMic] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
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
            <TouchableOpacity style={styles.buttonPopup}>
              <Text style={styles.buttonText}>View Submissions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonPopup}
              onPress={() => setScreen("submission")}
            >
              <Text style={styles.buttonText}>Confirm Submission</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* === SUBMISSION SCREEN === */}
            <View style={{ width: "100%", alignItems: "center" }}>
            {[2,8,6].map((item) => (
              <ActivityOneSubmissionCard key={item} item={item}/>
            ))}
      
            <TouchableOpacity style={styles.backBtn} onPress={() => setScreen("record")}>
              <Text style={styles.btnText}>Back To Recording Page</Text>
            </TouchableOpacity>
      
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    width: 250,
    height: 53,
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