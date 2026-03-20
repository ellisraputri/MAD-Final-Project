import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LiveRecorder from "./ui/audio-recording";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AudioPlayer from "./ui/audio-player";
import Button from "./ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";

type CardActivitySevenProps = {
  title: string;
  input: Record<number, string>;
  setInput: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  uri: string;
  levels: Array<any>;
  type: number;
	setIsEditing: () => void;
};

function CardActivitySeven(props: CardActivitySevenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.cardContainer, {borderWidth:1, borderColor:"white"}]}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <AudioPlayer uri={props.uri} levels={props.levels}/>
      <Text style={styles.cardSubtitle}>Prediction</Text>

      <Text style={styles.cardLabel}>Breath per Minute</Text>
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
        <Text style={styles.cardUnit}>breath per minute</Text>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={props.setIsEditing}>
				<Text style={styles.editBtnText}>Edit</Text>
			</TouchableOpacity>
    </View>
  );
}

export default function ActivitySevenScreen() {
    const theme = useAppTheme();
    const styles = createStyles(theme);

    const [phase, setPhase] = useState<1|2|3|4>(1);
    const [result, setResult] =  useState<Record<number, any>>({
        1:null, 2:null, 3:null
    });
    const [userInput, setUserInput] = useState<Record<number, string>>({
        1:"", 2:"", 3:""
    })
		const [isEditing, setIsEditing] = useState({
			title:"", type:0
		});

    const handleRetry =() =>{
        setPhase(1);
        setResult({1:null, 2:null, 3:null});
        setUserInput({1:"", 2:"", 3:""});
    }

    const handleSubmit = () =>{
        alert(`result1: ${userInput[1]}, resul2: ${userInput[2]}, result3: ${userInput[3]}`)
        router.push("/activity/[id]/results")
    }

    return(
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}        // critical for Android
            extraScrollHeight={10}        // extra space above keyboard
            enableAutomaticScroll={true}  
        >
            {phase === 1 && (
                <LiveRecorder 
                    onPressButton={()=>setPhase(2)}
                    type={1}
                    setResult={setResult}
                    buttonWidth={120} buttonText='Next' title='Breathing at Rest'
                    isDisabledButton={false}
                />
            )}

            {phase === 2 && (
                <LiveRecorder 
                    onPressButton={()=>setPhase(3)}
                    type={2}
                    setResult={setResult}
                    buttonWidth={120} buttonText='Next' title='Breathing after Exercise 1'
                    isDisabledButton={false}
                />
            )}

            {phase === 3 && (
                <LiveRecorder 
                    onPressButton={()=>setPhase(4)}
                    type={3}
                    setResult={setResult}
                    buttonWidth={140} buttonText='Confirm' title='Breathing after Exercise 2'
                    isDisabledButton={false}
                />
            )}

            {phase===4 && 
							(isEditing.type === 0? 
								<>
                    <CardActivitySeven 
                        title="Breathing at Rest" type={1}
                        input={userInput} setInput={setUserInput}
                        uri={result[1].uri} levels={result[1].levels}
												setIsEditing={() => setIsEditing({
													title:"Breathing at Rest", type:1
												})}
                    />
                    <CardActivitySeven 
                        title="Breathing after Exercise 1" type={2}
                        input={userInput} setInput={setUserInput}
                        uri={result[2].uri} levels={result[2].levels}
												setIsEditing={() => setIsEditing({
													title:"Breathing after Exercise 1", type:2
												})}
                    />
                    <CardActivitySeven 
                        title="Breathing after Exercise 2" type={3}
                        input={userInput} setInput={setUserInput}
                        uri={result[3].uri} levels={result[3].levels}
												setIsEditing={() => setIsEditing({
													title:"Breathing after Exercise 2", type:3
												})}
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
								:
								<>
									<LiveRecorder 
                    onPressButton={()=>setIsEditing({title:"", type:0})}
                    type={isEditing.type}
                    setResult={setResult}
                    buttonWidth={140} buttonText='Confirm' title={isEditing.title}
                    isDisabledButton={false}
                	/>
								</>
							)
                
            }


        </KeyboardAwareScrollView>
    );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
      cardTitle: {
      fontSize: 18,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 14,
    },

    cardSubtitle: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 5,
    },

    cardLabel: {
      fontSize: 16,
      color: theme.text,
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
      borderColor: theme.text,
      borderRadius: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      marginBottom: 15,
      fontFamily: "Lato_400Regular",
      fontSize: 16,
      color: theme.blackText,
    },

    cardUnit: {
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
      fontFamily: "Lato_400Regular",
    },

    cardContainer: {
      margin: 10,
      marginBottom: 20,
      padding: 20,
      elevation: 6,
      backgroundColor: theme.background,
      borderRadius: 10,
    },

    editBtn: {
      backgroundColor: theme.text,
      padding: 8,
      borderRadius: 6,
      alignItems: "center",
      alignSelf: 'flex-end',
      width: 80,
      height: 40,
      justifyContent: 'center',
      marginTop: 10,
    },
    editBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14
    }
  })
  return styles;
}