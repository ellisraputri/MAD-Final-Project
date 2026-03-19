import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LiveRecorder from "./ui/audio-recording";
import ActivityTwoSubmissionCard from "./ui/activity2-submission-card";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type audioType = {
	uri: string;
	levels: Array<any>;
	input:string;
}

const isAudioTypeEmpty = (obj: audioType) => {
	return obj.uri==="" && obj.levels.length===0 && obj.input===""
}

export default function ActivityTwoScreen() {
  const [screen, setScreen] = useState<"record" | "submission">("record");
  const [result, setResult] =  useState<Record<number, any>>({
			0:null, 1:null, 2:null
	});
	const [numNow, setNumNow] = useState(0);
  const [showModal, setShowModal] = useState(false);
	const [audios, setAudios] = useState<audioType[]>([
		{ uri: "", levels: [], input: ""}, 
		{ uri: "", levels: [], input: ""}, 
		{ uri: "", levels: [], input: ""}
	]);
  const [rerecordIndex, setRerecordIndex] = useState<number | null>(null);
	const currentIndex = rerecordIndex !== null ? rerecordIndex : numNow;
	const confirmDisabled = !result[currentIndex] || (rerecordIndex === null && numNow >= 3);
	const filledCount = audios.filter(a => a.uri !== "").length;

  const handleConfirmSubmission = () => {
		if (rerecordIndex !== null) {
			console.log(result[rerecordIndex])
			setAudios((prev) => {
				const updated = [...prev];
				updated[rerecordIndex] = result[rerecordIndex]; // ← use rerecordIndex, not numNow
				return updated;
			});
			console.log("rerecordIndex", rerecordIndex)
			setRerecordIndex(null);
		} else {
			console.log(result[numNow])
			if (numNow >= 3) return; // ← guard with numNow, not audios.length
			setAudios((prev) => {
				const updated = [...prev];
				updated[numNow] = result[numNow];
				return updated;
			});
			setNumNow(numNow + 1); // ← move inside else, so re-record doesn't increment
		}
		setScreen("submission");
	};

  const handleDelete = (index: number) => {
		setAudios((prev) => {
			const updated = prev.filter((_, i) => i !== index);
			while (updated.length < 3) {
				updated.push({ uri: "", levels: [], input: "" });
			}
			return updated;
		});

		// Shift result entries down too
		setResult((prev) => {
			const newResult: Record<number, any> = { 0: null, 1: null, 2: null };
			let newIndex = 0;
			for (let i = 0; i < 3; i++) {
				if (i === index) continue; // skip deleted
				newResult[newIndex] = prev[i];
				newIndex++;
			}
			return newResult;
		});

		setNumNow((prev) => Math.max(0, prev - 1));
		alert(`Deleted submission ${index + 1}`);
	};

  const handleRerecord = (index: number) => {
		setShowModal(false);
    setRerecordIndex(index);
    setScreen("record");
  };

  const handleFieldChange = (value: string, index: number) => {
    setAudios((prev) => {
      const updated = [...prev];
      updated[index].input = value;
      return updated;
    });
  }

  const handleSubmit = () => {
    const invalid = audios.some(v => !v.input);
    if (invalid) {
      alert("Please fill all prediction fields.");
      return;
    }

		if(filledCount < 3){
			alert(`You can only submit when there are 3 audios. Please continue to record ${3-filledCount} more videos.`)
		}
    else{
      alert(`Successfully submitted the videos! \n ${audios[0].input} ${audios[1].input} ${audios[2].input}`)
    }
  }

	const handleAfterRecording = () => {
		const index = rerecordIndex !== null ? rerecordIndex : numNow;
		setAudios((prev) => {
			const updated = [...prev];
			updated[index] = result[index];
			return updated;
		});
	}

  return (
    <View style={styles.mainView}>
      {screen === "record" ? (
        <>
          {/* === RECORDING UI === */}
          <LiveRecorder
						onPressButton={handleAfterRecording}
						type={rerecordIndex !== null ? rerecordIndex : numNow}
						setResult={setResult}
						buttonWidth={0} buttonText='' title='' isDisabledButton={true}
					/>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonPopup}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.buttonText}>
                View Submissions ({filledCount}/3)
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
            {(() => {
							let displayNum = 1;
							return audios.map((item, index) => {
								if (item.uri === "") return null;
								const num = displayNum++;
								return (
									<ActivityTwoSubmissionCard
										key={index}
										item={num}  // ← sequential display number
										uri={item.uri}
										input={item.input}
										levels={item.levels}
										onChangeInput={(value) => handleFieldChange(value, index)}
										onDelete={() => handleDelete(index)}
										onRerecord={() => handleRerecord(index)}
									/>
								);
							});
						})()}
      
            {filledCount < 3 && (
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
            {filledCount === 0 ? (
              <Text style={{fontFamily: "Lato_400Regular", fontSize: 18}}>No submissions yet</Text>
            ) : (
							(() => {
							let displayNum = 1;
							return audios.map((item, index) => {
								if (item.uri === "") return null;
								const num = displayNum++;
								return (
									<ActivityTwoSubmissionCard
										key={index}
										item={num}  // ← sequential display number
										uri={item.uri}
										input={item.input}
										levels={item.levels}
										onChangeInput={(value) => handleFieldChange(value, index)}
										onDelete={() => handleDelete(index)}
										onRerecord={() => handleRerecord(index)}
									/>
								);
							});
						})()
						)
					}	
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