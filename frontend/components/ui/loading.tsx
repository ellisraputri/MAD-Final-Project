import { useAppTheme } from "@/hooks/use-app-theme";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function Loading() {
    const theme = useAppTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.text}/>
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            flex: 1,
            marginTop: 50,
            justifyContent: "center",  
            alignItems: "center",      
        },
        text: {
            marginTop: 12,
            fontSize: 18,
            color: theme.blackText,
            fontFamily: 'Lato_400Regular'
        },
    });
    return styles;
}