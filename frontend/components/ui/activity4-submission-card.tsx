import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ActivityFourSubmissionCard(props: {
    item: number; 
    duration: string | null;
    movement: string;
    onChangeMovement: (text: string) => void;
    onDelete: () => void;
    onRerecord: () => void;
}){
    return(
        <View key={props.item} style={submissionStyles.card}>
          <View style={submissionStyles.titleRow}>
            <Text style={submissionStyles.title}>
                {props.item}. Submission {props.item}
            </Text>

            <TouchableOpacity onPress={props.onDelete}>
                <Ionicons name="trash-outline" size={22} color="#357D89" />
            </TouchableOpacity>
        </View>

            <View style={submissionStyles.subsContainer}>

                <Text style={submissionStyles.descText}>Vibration time: {props.duration} seconds</Text>

                <Text style={submissionStyles.prediction}>Prediction</Text>
                <Text style={submissionStyles.descText}>Phone moves (cm)</Text>
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
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 25,
        marginBottom: 40,
        elevation: 3,
    },
    title: {
        marginBottom: 10,
        fontFamily: "Lato_700Bold",
        color: '#357D89',
        fontSize: 20
    },
    prediction: {
        marginTop: 40,
        fontFamily: "Lato_700Bold",
        color: '#357D89',
        fontSize: 18
    },
    descText:{
        marginTop: 10,
        fontFamily: "Lato_400Regular",
        color: '#357D89',
        fontSize: 15
    },
    inputBox: {
        borderWidth: 0.8,
        height: 40,
        marginVertical: 10,
        marginBottom: 20,
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