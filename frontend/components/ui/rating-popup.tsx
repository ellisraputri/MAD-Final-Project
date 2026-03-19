import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Button from "./button";

export default function RatingPopup(props: { 
    id: string;
    showModal: boolean; 
    onClose: () => void; 
}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmitRating = () => {
        alert(`Rating: ${rating}, comment: ${comment}`);
    }

    return (
        <Modal visible={props.showModal} animationType="fade" transparent={true}>
            <View style={styles.overlay}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ width: "100%", alignItems: "center" }}>

                    <SafeAreaView style={styles.modalBox}>
                        <TouchableOpacity style={styles.closeBtn} onPress={props.onClose}>
                            <Ionicons name="close" size={35} color="#357D89" />
                        </TouchableOpacity>

                        <Text style={styles.title}>Rate Activity {props.id}</Text>

                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <TouchableOpacity
                                key={item}
                                style={styles.starContainer}
                                onPress={() => setRating(item)}
                                >
                                <Ionicons
                                    name={item <= rating ? "star" : "star-outline"}
                                    size={40}
                                    color={"#6FB3B8"}
                                />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Comment</Text>
                        <TextInput style={styles.commentBox} value={comment} onChangeText={setComment} multiline={true} />

                        <Button onPress={handleSubmitRating} width={200} fontSize={20} marginTop={30} text="Submit"/>

                    </SafeAreaView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark background
    justifyContent: "center",
    alignItems: "center",
},

modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
},

closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
},

title: {
    fontSize: 24,
    color: "#357D89",
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Lato_700Bold',
},

starRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between", 
    marginBottom: 25,
    marginTop: 10,
},

starContainer: {
    flex: 1,
    alignItems: "center", 
},

label: {
    fontSize: 24,
    color: "#357D89",
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Lato_400Regular',
},

commentBox: {
    height: 140,              // fixed height instead of flex
    borderWidth: 2,
    borderColor: "#357D89",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
}
});