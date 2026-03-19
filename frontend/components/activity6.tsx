import { router, useFocusEffect } from "expo-router";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import Signature from "react-native-signature-canvas";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "./ui/button";

type CardActivitySixProps = {
  title: string;
  input: Record<number, string>;
  setInput: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  type: number;
};

function CardActivitySix(props: CardActivitySixProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardSubtitle}>Prediction</Text>

      <Text style={styles.cardLabel}>Reaction time</Text>
      <View style={styles.cardInputRow}>
        <TextInput
          style={styles.cardInput}
          keyboardType="decimal-pad"
          value={props.input[props.type]?.toString() || ""}
          onChangeText={(text) => {
            if (/^\d*\.?\d*$/.test(text)) { // allow digits and one dot
              props.setInput((prev) => ({
                ...prev,
                [props.type]: text,
              }));
            }
          }}
        />
        <Text style={styles.cardUnit}>seconds delay</Text>
      </View>

      {props.type === 3 && (
        <>
        <Text style={styles.cardLabel}>Accuracy</Text>
        <View style={styles.cardInputRow}>
          <TextInput
            style={styles.cardInput}
            keyboardType="decimal-pad"
            value={props.input[props.type+1]?.toString() || ""}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) { // allow digits and one dot
                props.setInput((prev) => ({
                  ...prev,
                  [props.type+1]: text,
                }));
              }
            }}
          />
          <Text style={styles.cardUnit}>%</Text>
        </View>
        </>
      )}
    </View>
  );
}

export default function ActivitySixScreen() {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(4); 
  const [isWaiting, setIsWaiting] = useState<1 | 2 | 3>(1);
  const [reactionTimes, setReactionTimes] = useState<{ dominant: number | null; nonDominant: number | null }>({
    dominant: null,
    nonDominant: null,
  });
  const startTime = useRef<number>(0);
  const [traceData, setTraceData] = useState<string | null>(null);
  const signatureRef = useRef<any>(null);
  const traceStartTime = useRef<number | null>(null);
  const [traceMetrics, setTraceMetrics] = useState({
    time: null as number | null,
    accuracy: null as number | null
  });

  const [userInput, setUserInput] = useState<Record<number,string>>({1:"", 2:"", 3:"", 4:""});  //1 = time_phase_1, 2 = time_phase_2, 3 = time_phase_3, 4 = accuracy_phase_3

  useFocusEffect(
    useCallback(() => {
      setPhase(1);
      setIsWaiting(1);
      setReactionTimes({ dominant: null, nonDominant: null });
      setTraceData(null);
      setUserInput({1:"", 2:"", 3:"", 4:""});
      startTime.current = 0;
    }, [])
  );

  const startReactionTest = () => {
    setIsWaiting(2); // show "Get ready..."
    const delay = Math.random() * 2000 + 1000; 
    setTimeout(() => {
      startTime.current = Date.now();
      setIsWaiting(3); // show Stop button
    }, delay);
  };

  const stopReactionTest = () => {
    const elapsed = Date.now() - startTime.current;
    if (phase === 1) {
      setReactionTimes((prev) => ({ ...prev, dominant: elapsed }));
      setIsWaiting(1);
      setPhase(2); // move to second reaction test
    } else if (phase === 2) {
      setReactionTimes((prev) => ({ ...prev, nonDominant: elapsed }));
      setPhase(3); // move to tracing
    }
  };

  const handleTraceBegin = () => {
    traceStartTime.current = Date.now();
  };

  const handleTraceOK = (signature: string) => {
    const endTime = Date.now();

    let traceTime = null;

    if (traceStartTime.current) {
      traceTime = endTime - traceStartTime.current;
    }

    const accuracy = estimateAccuracy(traceTime);

    setTraceMetrics({
      time: traceTime,
      accuracy: accuracy
    });

    setTraceData(signature);
  };

  const estimateAccuracy = (traceTime: number | null) => {
    if (!traceTime) return null;

    const idealTime = 4000;
    const diff = Math.abs(traceTime - idealTime);
    const accuracy = Math.max(0, 1 - diff / idealTime);

    return Number((accuracy * 100).toFixed(2));
  };

  const handleConfirm = () => {
    signatureRef.current.readSignature();
  };

  const handleRetry = () => {
    setPhase(1);
    setIsWaiting(1);
    setReactionTimes({ dominant: null, nonDominant: null });
    setTraceData(null);
    setUserInput({1:"", 2:"", 3:"", 4:""});
    startTime.current = 0;
  }

  const handleSubmit = () => {
    alert(`time_phase_1: ${userInput[1]}, time_phase_2: ${userInput[2]}, time_phase_3: ${userInput[3]}, accuracy_phase_3: ${userInput[4]}`)
    router.push("/activity/[id]/results")
  }

  useEffect(() => {
  if (traceData) {
    setPhase(4);

    console.log("Reaction times:", reactionTimes);
    console.log("Trace metrics:", traceMetrics);
    console.log("Tracing data:", traceData);

    // alert(
    //   `Results:\nReaction Dominant: ${reactionTimes.dominant} ms\nReaction Non-Dominant: ${reactionTimes.nonDominant} ms\nTrace Time: ${traceMetrics.time} ms\nAccuracy: ${traceMetrics.accuracy}%`
    // );
  }
}, [traceData]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}        // critical for Android
      extraScrollHeight={10}        // extra space above keyboard
      enableAutomaticScroll={true}  // auto scrolls to focused input
    >
    <View style={styles.container}>
      {(phase === 1 || phase === 2) && (
        <>
          <Text style={styles.title}>
            Phase {phase} — Reaction Test ({phase === 1 ? "Dominant" : "Non-Dominant"} Hand)
          </Text>

          <View style={[styles.card, styles.phase12]}>
            {isWaiting === 2 ? (
              <Text style={styles.readyText}>Get ready...</Text>
            ) : (
              <Pressable
                style={isWaiting === 1? styles.startButton : styles.stopButton}
                onPress={isWaiting == 1 ? startReactionTest : stopReactionTest}
              >
                <Text style={isWaiting === 1? styles.startText : styles.stopText}>
                  {isWaiting == 1 ? "Start" : "Stop"}
                </Text>
              </Pressable>
            )}
          </View>
        </>
      )}

      {phase === 3 && (
        <>
          <Text style={styles.title}>Phase 3 — Tracing Challenge</Text>
          <View style={[styles.card, styles.phase3]}>
            <View style={{ height: 200, marginVertical: 10 }}>
              <Signature
                ref={signatureRef}
                onBegin={handleTraceBegin}
                onOK={handleTraceOK}
                descriptionText="Trace the pattern"
                clearText="Clear"
                confirmText="Confirm"
                webStyle={signaturePadStyle}
                penColor="#388087" 
              />
            </View>
          </View>

          <Button 
            onPress={handleConfirm}
            width = {150}
            fontSize = {20}
            marginTop = {10}
            text = {"Confirm"}
          />
        </>
      )}

      {phase === 4 && (
        <>
          <CardActivitySix 
            title="Phase 1 - Reaction Test (Dominant Hand)" 
            input={userInput}
            setInput={setUserInput}
            type={1}
          />
          <CardActivitySix 
            title="Phase 2 - Reaction Test (Non-Dominant Hand)" 
            input={userInput}
            setInput={setUserInput}
            type={2}
          />
          <CardActivitySix 
            title="Phase 3 - Tracing Challenge" 
            input={userInput}
            setInput={setUserInput}
            type={3}
          />

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <Button 
              onPress={handleRetry}
              width={120}
              fontSize={18}
              marginTop={10}
              text={"Retry"}
            />
            <Button 
              onPress={handleSubmit}
              width={120}
              fontSize={18}
              marginTop={10}
              text={"Confirm"}
            />
          </View>
        </>
      )}
    </View>
    </KeyboardAwareScrollView>
  );
}

const signaturePadStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: none;
  }
  .m-signature-pad--body {
    border: 1px solid #3A6F78;
  }
  .m-signature-pad--body canvas {
    background-image: url("https://coloringlib.com/wp-content/uploads/2024/01/truck-tracing-sheet-coloring.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  body, html {
    width: 100%; height: 100%;
  }
`;

const styles = StyleSheet.create({
  container: { flex: 1},
  card: { borderRadius: 12, height: 300 },
  phase12: { 
    backgroundColor: "#BADFE7", 
    justifyContent: "center", 
    alignItems: "center", 
    borderColor: "#357D89",
    borderWidth: 1,
  },
  phase3: { backgroundColor: "#BADFE7", borderWidth: 1, borderColor: "#357D89" },
  title: { fontSize: 20, fontWeight: "600", color: "#357D89", lineHeight: 28, marginBottom: 15 },
  startButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#357D89",
    justifyContent: "center",
    alignItems: "center",
  },
  startText: { color: "#357D89", fontSize: 20, fontFamily: "Lato_700Bold" },
  stopText: { color: "white", fontSize: 20, fontFamily: "Lato_700Bold" },
  readyText: {
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Lato_700Bold",
    color: "#357D89",
    fontSize: 24,
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: "Lato_700Bold",
    color: "#357D89",
    marginBottom: 14,
  },

  cardSubtitle: {
    fontSize: 16,
    fontFamily: "Lato_700Bold",
    color: "#357D89",
    marginBottom: 5,
  },

  cardLabel: {
    fontSize: 16,
    color: "#357D89",
    marginBottom: 5,
    fontFamily: "Lato_400Regular"
  },

  cardInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: "#357D89",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 15,
    fontFamily: "Lato_400Regular",
    fontSize: 16,
  },

  cardUnit: {
    marginLeft: 12,
    fontSize: 16,
    color: "#357D89",
    fontFamily: "Lato_400Regular",
  },

  cardContainer: {
    margin: 10,
    marginBottom: 20,
    padding: 20,
    elevation: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});