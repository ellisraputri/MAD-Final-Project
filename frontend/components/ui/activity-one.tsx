import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";

export default function ActivityOneScreen() {
  const cameraRef = useRef<CameraView | null>(null);

  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();
  const [permissionMic, requestPermissionMic] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const player = useVideoPlayer(videoUri ? { uri: videoUri } : null);

  useEffect(() => {
    if (videoUri && player) {
      player.loop = true;
      player.play();
    }
  }, [videoUri, player]);

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
    if (videoUri) setVideoUri(null);

    if (cameraRef.current) {
      setRecording(true);
      const video = await cameraRef.current.recordAsync();
      setVideoUri(video?.uri ?? null);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  return (
    <View style={styles.mainView}>
        <CameraView
          ref={cameraRef}
          style={styles.videoScreen}
          mode="video"
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
        

        <Text style={styles.currText}>Current Recording:</Text>

        {!videoUri ? (
            <Text>No video available!</Text>
        ) : (
            <VideoView
            player={player!}
            style={styles.videoScreen}
            nativeControls
            />
        )}

        {/* view submissions btn */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonPopup}>
                <Text style={styles.buttonText}>View Submissions</Text>
            </TouchableOpacity>
        </View>

        {/* confirm submission btn */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonPopup}>
                <Text style={styles.buttonText}>Confirm Submission</Text>
            </TouchableOpacity>
        </View>

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
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    color: '#388087',
    fontWeight: '500',
    fontFamily: "Nunito_700Bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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

  currText: {
    marginTop: 100,
    marginBottom: 20,
    fontSize: 20,
    color: '#357D89',
    fontWeight: '500',
    fontFamily: "Lato_700Bold",
  }
});