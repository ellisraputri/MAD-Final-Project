import { useAppTheme } from "@/hooks/use-app-theme";
import { Text, View } from "react-native";
import { createResultStyles } from "./activity-result-style";

export default function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = createResultStyles(theme);

  return (
    <View style={{ marginBottom: 50 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </View>
  );
}
