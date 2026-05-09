import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Accordion({
  title,
  children,
  marginBottom,
}: {
  title: string;
  children: React.ReactNode;
  marginBottom: number;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme, marginBottom);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.text}
        />
      </TouchableOpacity>

      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

const createStyles = (theme: any, marginBtm: number) => {
  const styles = StyleSheet.create({
    accordionContainer: {
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 8,
      marginTop: 30,
      overflow: "hidden",
      marginBottom: marginBtm,
    },
    accordionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      backgroundColor: theme.hoverBackground,
    },
    accordionTitle: {
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: theme.text,
    },
    accordionContent: {
      padding: 14,
      gap: 4,
    },
  });
  return styles;
};
