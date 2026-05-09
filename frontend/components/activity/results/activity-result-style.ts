import { StyleSheet } from "react-native";

export const createResultStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 5,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      fontFamily: "Lato_700Bold",
    },

    divider: {
      height: 2,
      backgroundColor: theme.text,
      marginVertical: 10,
    },

    paragraph: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "justify",
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    subtitle: {
      marginTop: 30,
      fontSize: 17,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 10,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    subsContainer: {
      marginLeft: 20,
    },
    titleRow: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    card: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 20,
      marginBottom: 30,
      elevation: 3,
    },
    title: {
      marginBottom: 20,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 20,
    },
    videoPlaceholder: {
      height: 400,
      width: "100%",
      borderWidth: 2,
      borderColor: theme.text,
      backgroundColor: theme.hoverBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      overflow: "hidden",
    },
    prediction: {
      marginTop: 15,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 18,
    },
    subtitleText: {
      marginTop: 10,
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: theme.blackText,
    },
    descText: {
      marginTop: 10,
      fontFamily: "Lato_400Regular",
      fontSize: 15,
      color: theme.blackText,
    },
    closeBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
    },
    list: {
      marginLeft: 10,
      marginTop: 4,
    },
    listItem: {
      fontSize: 15,
      fontFamily: "Lato_400Regular",
      marginBottom: 5,
      color: theme.blackText,
    },
    calculationText: {
      fontSize: 15,
      fontFamily: "Lato_400Regular",
      marginBottom: 15,
      color: theme.blackText,
    },
    subtitle2Text: {
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: theme.blackText,
      marginBottom: 5,
    },
    viewAudio: {
      marginBottom: 10,
    },
    padContainer: {
      width: 300,
      height: 200,
    },
    image: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    overlay: {
      zIndex: 200,
    },
    inputContainer: {
      flexDirection: "row",
      alignContent: "space-between",
      alignItems: "center",
      gap: 6,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 14,
      paddingVertical: 8,
      fontFamily: "Lato_400Regular",
      marginTop: -4,
      marginBottom: 20,
      color: theme.blackText,
    },
    descContainer: {
      flex: 1,
      flexDirection: "column",
      gap: 6,
    },
    warning: {
      marginTop: 4,
      fontFamily: "Lato_400Regular",
      fontSize: 15,
      color: theme.text,
      textAlign: "center",
    },
    warningContainer: {
      borderWidth: 2,
      borderColor: theme.text,
      padding: 3,
      alignItems: "center",
    },
  });
  return styles;
};
