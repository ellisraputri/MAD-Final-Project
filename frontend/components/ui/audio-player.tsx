import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function AudioPlayer({ uri, levels }: { uri: string; levels: Array<any> }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false); // mirror of isPlaying for use inside callbacks

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
    }

    if (status.didJustFinish) {
      soundRef.current?.setPositionAsync(0);
      setIsPlaying(false);
      isPlayingRef.current = false;
      setProgress(0);
    }
  }, []);

  const loadSound = async (): Promise<Audio.Sound> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, progressUpdateIntervalMillis: 50, isLooping: false },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    return sound;
  };

  const togglePlay = async () => {
    // prevent double-tap race
    if (isPlayingRef.current !== isPlaying) return;

    if (!soundRef.current) {
      const sound = await loadSound();
      isPlayingRef.current = true;
      setIsPlaying(true);
      await sound.playAsync();
      return;
    }

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      await soundRef.current.pauseAsync();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      await soundRef.current.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlay} style={styles.button}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.waveContainer}>
        {levels.map((level, i) => {
          const played = i / levels.length < progress;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                { height: level, backgroundColor: played ? "#388087" : "#ccc" },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#388087",
    justifyContent: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginRight: 10,
  },
  waveContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
  },
  bar: {
    width: 3,
    backgroundColor: "#1E1E1E",
    borderRadius: 2,
  },
});