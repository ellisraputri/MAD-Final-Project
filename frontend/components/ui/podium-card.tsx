import { View, Text, StyleSheet, Image } from "react-native";

type Props = {
  rank: number;
  name: string;
  score: string;
  imageUrl: string;
};

export default function PodiumCard({ rank, name, score, imageUrl }: Props) {
  const medal =
    rank === 1
      ? require("@/assets/images/gold.png")
      : rank === 2
      ? require("@/assets/images/silver.png")
      : require("@/assets/images/bronze.png");

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Image source={medal} style={styles.medal} />
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 24,
  },

  medal: {
    position: "absolute",
    top: -15,
    right: -10,
    width: 40,
    height: 50,
  },

  name: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "600",
    width: 100,
    fontFamily: "Lato_700Bold",
    textAlign: "center",
  },

  score: {
    marginTop: 3,
    fontSize: 16,
    width: 100,
    fontFamily: "Lato_700Bold",
    textAlign: "center",
  },
});