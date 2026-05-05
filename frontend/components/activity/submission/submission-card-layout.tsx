import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { createSubmissionCardStyles } from "./submissionCardStyle";

type Props = {
  item: number;
  onDelete: () => void;
  onRerecord: () => void;
  children: React.ReactNode;
};

export default function SubmissionCardLayout({
  item,
  onDelete,
  onRerecord,
  children,
}: Props) {
  const theme = useAppTheme();
  const styles = createSubmissionCardStyles(theme);

  return (
    <View key={item} style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>
          {item}. Submission {item}
        </Text>

        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.subsContainer}>
        {children}
        <TouchableOpacity style={styles.editBtn} onPress={onRerecord}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
