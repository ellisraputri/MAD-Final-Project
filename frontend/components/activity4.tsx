import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Vibration, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ActivityFourSubmissionCard from "./ui/activity4-submission-card";
import Button from "./ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppContext } from "@/context/AppContext";
import { submitResult } from "@/services/result/result";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { uploadMedia45 } from "@/services/media/media";

export default function ActivityFourScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {team} = useAppContext();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [screen, setScreen] = useState<"record" | "submission">("record");
  
  const [vibrations, setVibrations] = useState<{
    duration: string;
    movement: string;
  }[]>([]);
  const [isVibrating, setIsVibrating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [rerecordIndex, setRerecordIndex] = useState<number | null>(null);

  const handleVibration = () => {
    if (isVibrating) {
      Vibration.cancel();
      
      if (startTime) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(duration);
      }

      if (intervalId) clearInterval(intervalId);
      setIsVibrating(false);
    } 
    else {
      Vibration.vibrate([0, 5000], true); 
      const start = Date.now();
      setStartTime(start);

      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);

      setIntervalId(interval);
      setIsVibrating(true);
    }
  };
  
  const handleConfirmSubmission = () => {
    if (elapsedTime === 0 || vibrations.length >= 3) return;

    if (rerecordIndex !== null) {
      setVibrations((prev) => {
        const updated = [...prev];
        updated[rerecordIndex] = {
          ...updated[rerecordIndex],
          duration: elapsedTime.toString(),
        };
        return updated;
      });
      setRerecordIndex(null);
    } 
    else {
      if (vibrations.length >= 3) return;
      setVibrations((prev) => [
        ...prev,
        {
          duration: elapsedTime.toString(),
          movement: "",
        },
      ]);
    }

    setElapsedTime(0);
    setScreen("submission");
  };

  const handleDelete = (index: number) => {
    setVibrations((prev) => prev.filter((_, i) => i !== index));
    alert(`Deleted submission ${index+1}`)
  };

  const handleRerecord = (index: number) => {
    setRerecordIndex(index);
    setElapsedTime(0);
    setScreen("record");
  };

  const handleFieldChange = (value: string, index: number) => {
    setVibrations((prev) => {
      const updated = [...prev];
      updated[index].movement = value;
      return updated;
    });
  }

  const handleSubmit = async() => {
    if(!team?.id || submitLoading) return;

    const invalid = vibrations.some(v => !v.movement);
    if (invalid) {
      alert("Please fill all fields.");
      return;
    }

    const currLength = vibrations.length;
    if(currLength < 3){
      alert(`You can only submit when there are 3 inputs. Please continue to record ${3-currLength} more videos.`)
      return;
    }
    
    setSubmitLoading(true);
    const uploads = vibrations.map((vib, index) => {
      return uploadMedia45({
        text: vib.duration,
        type: "string",
      });
    });
    const medias = await Promise.all(uploads);

    const ids = medias.map((media,_) => {
      return media.id
    })
    const predictions = vibrations.map((vib, _) => {
      return {
        prediction: Number(vib.movement),
      }
    })

    const response = await submitResult({
      activityId: "4", 
      teamId: team?.id, 
      medias: ids, 
      predictions: predictions
    })
    if(!response.success){
      toast.error(response.message);
      setSubmitLoading(false);
      return;
    }

    setSubmitLoading(false);
    Alert.alert(
      "Success",
      "Successfully submitted the vibrations and predictions!",
      [
        {
          text: "OK",
          onPress: () => {
            resetState();
            router.push({
              pathname: "/activity/[id]/results",
              params: { id: '4' }, 
            });
          },
        },
      ]
    );
  }

  const resetState = () => {
    if (intervalId) clearInterval(intervalId); 
    Vibration.cancel();

    setVibrations([]);
    setIsVibrating(false);
    setStartTime(null);
    setElapsedTime(0);
    setIntervalId(null);
    setRerecordIndex(null);
    setScreen('record');
    setSubmitLoading(false);
  }

  const confirmDisabled = (elapsedTime === 0) || (rerecordIndex === null && vibrations.length >= 3);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const paddedMins = mins.toString().padStart(2, "0");
    const paddedSecs = secs.toString().padStart(2, "0");
    return `${paddedMins} : ${paddedSecs}`;
  };

  return (
    <View style={styles.mainView}>
      {screen === "record" ? (
        <>
          {/* === RECORDING UI === */}
          <Text style={styles.titleText}>
            {rerecordIndex !== null
              ? `Re-record Submission ${rerecordIndex + 1}`
              : "New Recording"}
          </Text>

          <Text style={styles.timer}>
            {formatTime(elapsedTime)}
          </Text>

          <TouchableOpacity style={isVibrating ? styles.stopCircle : styles.circle} onPress={handleVibration}>
            <Text style={styles.circleText}>
              {isVibrating ? "Stop\nVibration" : "Start\nVibration"}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => setShowModal(true)}
              width={300} 
              height={53} 
              fontSize={20}
              marginTop={20} 
              text={`View Submissions (${vibrations.length}/3)`}
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
            {vibrations.map((item, index) => (
              <ActivityFourSubmissionCard
                key={index}
                item={index + 1}
                duration={item.duration}
                movement={item.movement}
                onChangeMovement={(value) => handleFieldChange(value, index)}
                onDelete={() => handleDelete(index)}
                onRerecord={() => handleRerecord(index)}
              />
            ))}
      
            {vibrations.length < 3 && (
              <Button 
                onPress={() => {
                  setRerecordIndex(null);
                  setScreen("record");
                }} 
                width={260} fontSize={18} height={53}
                marginTop={20} text="Add Another Submission"/>
            )}
      
            <Button onPress={handleSubmit} width={150} fontSize={18} 
                marginTop={20} marginBottom={50} text="Submit" isLoading={submitLoading} />
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
            {vibrations.length === 0 ? (
              <Text style={{color: theme.blackText}}>No submissions yet</Text>
            ) : (
              vibrations.map((item, index) => (
                <ActivityFourSubmissionCard
                  key={index}
                  item={index + 1}
                  duration={item.duration}
                  movement={item.movement}
                  onChangeMovement={(value) => handleFieldChange(value, index)}
                  onDelete={() => {
                    handleDelete(index);
                    if (vibrations.length === 1) setShowModal(false);
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

    timer: {
      fontSize: 28,
      color: theme.text,
      fontFamily: 'Lato_700Bold',
      marginBottom: 25,
      marginTop: 5
    },

    circle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: "#BADFE7",
      justifyContent: "center",
      alignItems: "center",
    },
    circleText: {
      fontSize: 32,
      color: "#357D89",
      fontFamily: 'Lato_400Regular',
      textAlign: "center",
      lineHeight: 45
    },

    stopCircle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: "#F6F6F2",
      borderColor: '#badfe7',
      borderWidth: 5,
      justifyContent: "center",
      alignItems: "center",
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
      marginTop: 10,
      fontSize: 24,
      color: theme.text,
      fontWeight: '500',
      fontFamily: "Lato_700Bold",
    },
  });
  return styles;
}