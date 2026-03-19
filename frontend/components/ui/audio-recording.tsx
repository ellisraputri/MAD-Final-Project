import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Button from './button';

type liveRecorderProps = {
    title: string,
    buttonText: string,
    buttonWidth: number,
    type: number,
    isDisabledButton: boolean,
    setResult: React.Dispatch<React.SetStateAction<Record<number, any>>>,
    onPressButton: () => void,
}

export default function LiveRecorder(props: liveRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording|null>(null);
	const recordingRef = useRef<Audio.Recording|null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [levels, setLevels] = useState(Array(50).fill(0));

  const intervalRef = useRef<number | null>(null);
	const isStoppedRef = useRef(false);
	const hasRecordedRef = useRef(false);

  const startRecording = async () => {
		isStoppedRef.current = false;
		hasRecordedRef.current = false;
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true, // 👈 IMPORTANT
      });

      setRecording(recording);
			recordingRef.current = recording;

      props.setResult((prev) => ({
            ...prev,
            [props.type]: recording,
        }));
      setIsRecording(true);

      // 🎯 Start polling metering
      intervalRef.current = setInterval(async () => {
        const status = await recording.getStatusAsync();

        if (status.metering !== undefined) {
          const normalized = normalizeMetering(status.metering);

          setLevels(prev => {
            const next = [...prev, normalized];
            next.shift();
            return next;
          });
        }
      }, 100);

    } catch (err) {
      console.error(err);
    }
  };

	const stopRecording = async () => {
  if (isStoppedRef.current) return;
  isStoppedRef.current = true; // 🛡️ set BEFORE any await
	hasRecordedRef.current = true;

  if (intervalRef.current !== null) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  const currentRecording = recordingRef.current; // use ref, not state
  if (currentRecording) {
    try {
      await currentRecording.stopAndUnloadAsync();
    } catch (e) {
      console.warn("stopAndUnload error (ignored):", e);
    }
    const uri = currentRecording.getURI();
    props.setResult((prev) => ({
      ...prev,
      [props.type]: { uri, levels },
    }));
  }

  recordingRef.current = null; // clear ref
  setRecording(null);
  setIsRecording(false);
};

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let timer: any;

        if (isRecording) {
            timer = setInterval(() => {
            setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isRecording]);

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

  return (
    <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{props.title}</Text>

        {/* Timer */}
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

        {/* Big Mic Button */}
        <TouchableOpacity
        style={[
            styles.bigMicInner,
            isRecording? { backgroundColor: '#d9534f' } : { backgroundColor: "#BADFE7"}
        ]}
        onPress={toggleRecording}
        >
            <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={isRecording? 80 : 100}
                color={isRecording? "white" : "#388087"}
            />
        </TouchableOpacity>

        {/* Waveform */}
        <View style={styles.waveContainer}>
            <View style={styles.waveRow}>
                {levels.map((level, i) => (
                <View
                    key={i}
                    style={[
                    styles.bar,
                    { height: level }
                    ]}
                />
                ))}
            </View>
        </View>

        {!props.isDisabledButton && <Button 
            width={props.buttonWidth}
            onPress={async () => {
							if (isRecording) {
								// still recording — stop then proceed
								await stopRecording();
								props.onPressButton();
								isStoppedRef.current = false;
							} else if (hasRecordedRef.current) {
								// already stopped and saved — proceed
								props.onPressButton();
							} else {
								// never recorded
								alert("Please record first.");
							}
						}}
            marginTop={20}
            fontSize={20}
            text={props.buttonText}
        />
        }
    </View>
    );
}

// 🎯 Convert dB → height
function normalizeMetering(db: number) {
  const minDb = -60;
  const maxDb = 0;

  const clamped = Math.max(minDb, db);
  const normalized = (clamped - minDb) / (maxDb - minDb);

  return normalized * 30 + 5; // height in px
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    color: '#357D89',
    marginBottom: 10,
  },

  timer: {
    fontSize: 20,
    color: '#4f7c82',
    marginBottom: 20,
    fontFamily: "Lato_700Bold",
  },

  bigMicInner: {
    width: 200,
    height: 200,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
  },

  waveContainer: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#388087',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },

  bar: {
    width: 3,
    backgroundColor: '#1E1E1E',
    borderRadius: 2,
  },
});