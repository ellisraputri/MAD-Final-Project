import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ActivityFiveSubmissionCard(props: {
    item: number; 
    duration: string | null;
    movement: string;
    onChangeMovement: (text: string) => void;
    onDelete: () => void;
    onRerecord: () => void;
}){
    const theme = useAppTheme();
    const submissionStyles = createStyles(theme);

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

                <Text style={submissionStyles.descText}>Vibration time: {props.duration} seconds</Text>

                <Text style={submissionStyles.prediction}>Prediction</Text>
                <Text style={submissionStyles.descText}>Phone vibration sensor (cm)</Text>
                <TextInput
                    style={submissionStyles.inputBox}
                    value={props.movement}
                    onChangeText={props.onChangeMovement}
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
        subsContainer:{
            marginLeft: 20,
        },
        titleRow:{
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        card: {
            marginTop: 10,
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
            marginBottom: 10,
            fontFamily: "Lato_700Bold",
            color: theme.text,
            fontSize: 20
        },
        prediction: {
            marginTop: 40,
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
            backgroundColor: "#388087",
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