import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function AudioPlayer({ uri, levels }: { uri: string; levels: Array<any> }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false); // mirror of isPlaying for use inside callbacks
  const isProcessingRef = useRef(false);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setIsPlaying(status.isPlaying);

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
  if (isProcessingRef.current) return; // HARD LOCK
  isProcessingRef.current = true;

  try {
    if (!soundRef.current) {
      const sound = await loadSound();
      await sound.playAsync();
      setIsPlaying(true);
      isPlayingRef.current = true;
      return;
    }

    if (isPlayingRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  } catch (e) {
    console.error("Audio toggle error:", e);
  } finally {
    isProcessingRef.current = false; // RELEASE LOCK
  }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlay} style={styles.button}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.waveContainer}>
        {levels.map((level, i) => {
          const played = i / levels.length < progress;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                { height: level, backgroundColor: played ? theme.text : theme.blackText },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      width: "100%",
      height: 50,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: theme.text,
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
      backgroundColor: theme.blackText,
      borderRadius: 2,
    },
  });
  return styles;
}