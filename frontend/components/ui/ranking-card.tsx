import { useAppTheme } from "@/hooks/use-app-theme";
import { Image, StyleSheet, Text, View } from "react-native";

type RankingCardProps = {
    imageUrl: string
    teamName: string
    rank: string 
    score: string 
}

export default function RankingCard(props: RankingCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

    return (
    <View style={[styles.card, theme.isDark && {borderWidth:1, borderColor:"white"}]}>
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

export const createStyles = (theme: any) => {
    const styles = StyleSheet.create({
        card: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.background,
            padding: 12,
            borderRadius: 8,
            elevation: 3,
        },

        rank: {
            fontFamily: "Lato_700Bold",
            fontSize: 18,
            marginRight: 20,
            color: theme.blackText,
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
            color: theme.blackText,
        },

        score: {
            fontSize: 18,
            fontFamily: "Lato_700Bold",
            color: theme.blackText,
        },
    })
    return styles
}