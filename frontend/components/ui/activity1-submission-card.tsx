import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import VideoPlayer from "./video-player";
import { useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";


export default function ActivityOneSubmissionCard(props: {
    item: number; 
    videoUri: string | null;
    mass: string;
    time: string;
    onChangeMass: (text: string) => void;
    onChangeTime: (text: string) => void;
    onDelete: () => void;
    onRerecord: () => void;
}){
    const theme = useAppTheme();
    const submissionStyles = createStyles(theme);

    const [showVideoModal, setShowVideoModal] = useState(false);

    return(
        <View key={props.item} style={submissionStyles.card}>
          <View style={submissionStyles.titleRow}>
            <Text style={submissionStyles.title}>
                {props.item}. Submission {props.item}
            </Text>

            <TouchableOpacity onPress={props.onDelete}>
                <Ionicons name="trash-outline" size={22} color={theme.text} />
            </TouchableOpacity>
        </View>

            <View style={submissionStyles.subsContainer}>
                <View style={submissionStyles.videoPlaceholder}>
                    {props.videoUri ? (
                        <>
                            <TouchableOpacity
                            style={submissionStyles.playOverlay}
                            onPress={() => setShowVideoModal(true)}
                            >
                            <Ionicons name="play-circle" size={60} color={theme.text} />
                            <Text style={submissionStyles.tapText}>Tap to play</Text>
                            </TouchableOpacity>

                            <Modal visible={showVideoModal} animationType="slide" transparent={false}>
                                <View style={submissionStyles.fullscreenModal}>
                                    <VideoPlayer link={props.videoUri} vidHeight={400} vidWidth={320} />
                                    <TouchableOpacity
                                    style={submissionStyles.closeVideoBtn}
                                    onPress={() => setShowVideoModal(false)}
                                    >
                                    <Text style={submissionStyles.editBtnText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </>
                    ) : (
                        <Text style={submissionStyles.descText}>No video</Text>
                    )}
                </View>

                <Text style={submissionStyles.descText}>Mass of toy (gram)</Text>
                <TextInput
                    style={submissionStyles.inputBox}
                    value={props.mass}
                    onChangeText={props.onChangeMass}
                    keyboardType="numeric"
                />

                <Text style={submissionStyles.prediction}>Prediction</Text>

                <Text style={submissionStyles.descText}>Time to hit ground (seconds)</Text>
                <TextInput
                    style={submissionStyles.inputBox}
                    value={props.time}
                    onChangeText={props.onChangeTime}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={submissionStyles.editBtn} onPress={props.onRerecord}>
                    <Text style={submissionStyles.editBtnText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const createStyles = (theme: any) => {
    const submissionStyles = StyleSheet.create({
        playOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        tapText: {
            marginTop: 8,
            color: theme.text,
            fontFamily: "Lato_400Regular",
            fontSize: 20,
        },
        fullscreenModal: {
            flex: 1,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeVideoBtn: {
            position: 'absolute',
            bottom: 80, 
            backgroundColor: theme.text,
            padding: 10,
            borderRadius: 8,
            width: 120,
            alignItems: 'center',
        },
        subsContainer:{
            marginLeft: 20,
        },
        titleRow:{
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        card: {
            width: '90%',
            backgroundColor: theme.background,
            borderWidth: theme.isDark ? 1 : 0,
            borderColor: theme.isDark ? theme.blackText : "transparent",
            borderRadius: 10,
            padding: 25,
            marginBottom: 40,
            elevation: 3,
        },
        title: {
            marginBottom: 20,
            fontFamily: "Lato_700Bold",
            color: theme.text,
            fontSize: 20
        },
        videoPlaceholder: {
            height: 400,
            width: '100%',
            borderWidth: 2,
            borderColor: theme.text,
            backgroundColor: theme.hoverBackground,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            overflow: 'hidden'
        },
        prediction: {
            marginTop: 15,
            fontFamily: "Lato_700Bold",
            color: theme.text,
            fontSize: 18
        },
        descText:{
            marginTop: 10,
            fontFamily: "Lato_400Regular",
            color: theme.text,
            fontSize: 15
        },
        inputBox: {
            borderWidth: 0.8,
            height: 40,
            marginVertical: 10,
            marginBottom: 20,
            borderColor: theme.blackText,
            color: theme.blackText
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
    });
    return submissionStyles;
}