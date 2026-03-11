import { Image, StyleSheet, Text, View } from "react-native";

type RankingCardProps = {
    imageUrl: string
    teamName: string
    rank: string 
    score: string 
}

export default function RankingCard(props: RankingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.rank}>#{props.rank}</Text>

      <Image
        source={{uri: props.imageUrl}}
        style={styles.cardLogo}
      />

      <Text style={styles.cardTeam}>{props.teamName}</Text>

      <Text style={styles.score}>{props.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        elevation: 3,
    },

    rank: {
        fontFamily: "Lato_700Bold",
        fontSize: 18,
        marginRight: 20,
    },

    cardLogo: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },

    cardTeam: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Lato_400Regular",
    },

    score: {
        fontSize: 18,
        fontFamily: "Lato_700Bold",
    },
})