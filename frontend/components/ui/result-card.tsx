import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type ResultCardProps = {
    index: number,
    score: number,
    onPress: ()=>void,
}

export default function ResultCard(props: ResultCardProps) {
  return (
    <Pressable style={styles.card} onPress={props.onPress}>
      <Text style={styles.cardTeam}>Attempt {props.index}</Text>

      <Text style={styles.score}>{props.score}%</Text>
      <Ionicons name="chevron-forward-outline" size={20} color={"#295F6B"}/>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        paddingVertical: 18,
        elevation: 3,
    },
    rank: {
        fontFamily: "Lato_700Bold",
        fontSize: 18,
        marginRight: 20,
    },
    cardTeam: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Lato_400Regular",
    },
    score: {
        fontSize: 18,
        fontFamily: "Lato_700Bold",
        marginRight: 10,
    },
})