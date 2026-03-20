import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import VideoPlayer from "./video-player";
import { useState } from "react";
import AudioPlayer from "./audio-player";
import { useAppTheme } from "@/hooks/use-app-theme";


export default function ActivityTwoSubmissionCard(props: {
    item: number; 
    uri: string | null;
    levels: Array<number>;
    input: string
    onChangeInput: (text: string) => void;
    onDelete: () => void;
    onRerecord: () => void;
}){
    const theme = useAppTheme();
    const submissionStyles = createStyles(theme);

    return(
        <View key={props.item} style={[submissionStyles.card, theme.isDark && {borderColor: "white", borderWidth:1}]}>
          <View style={submissionStyles.titleRow}>
            <Text style={submissionStyles.title}>
                {props.item}. Submission {props.item}
            </Text>

            <TouchableOpacity onPress={props.onDelete}>
                <Ionicons name="trash-outline" size={22} color={theme.text} />
            </TouchableOpacity>
        </View>

            <View style={submissionStyles.subsContainer}>
                {props.uri ? (
                    <AudioPlayer uri={props.uri} levels={props.levels}/>
                ) : (
                    <Text style={submissionStyles.descText}>No audio</Text>
                )}

                <Text style={submissionStyles.prediction}>Prediction</Text>

                <Text style={submissionStyles.descText}>Order of Loudness (among all submissions)</Text>
                <TextInput
                    style={[submissionStyles.inputBox, {borderWidth:1, borderColor:"white"}]}
                    value={props.input}
                    onChangeText={props.onChangeInput}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={submissionStyles.editBtn} onPress={props.onRerecord}>
                    <Text style={submissionStyles.editBtnText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const createStyles = (theme: any) => {
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
            color: theme.blackText,
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