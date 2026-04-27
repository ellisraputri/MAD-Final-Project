import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type ResultCardProps = {
  index: number;
  score: number;
  onPress: () => void;
};

export default function ResultCard(props: ResultCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={[styles.card, { borderColor: theme.lightText, borderWidth: 1 }]}
      onPress={props.onPress}
    >
      <Text style={styles.cardTeam}>Attempt {props.index}</Text>

      <Text style={styles.score}>{props.score.toFixed(3)}%</Text>
      <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
    </Pressable>
  );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 12,
      paddingVertical: 18,
      elevation: 3,
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
      marginRight: 10,
      color: theme.blackText,
    },
  });

  return styles;
};
