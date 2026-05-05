import { StyleSheet } from "react-native";

export const createSubmissionCardStyles = (theme: any) => {
  const submissionStyles = StyleSheet.create({
    subsContainer: {
      marginLeft: 20,
    },
    titleRow: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    card: {
      width: "90%",
      backgroundColor: theme.background,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.isDark ? theme.blackText : "transparent",
      borderRadius: 10,
      padding: 25,
      marginBottom: 40,
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
      marginTop: 30,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 18,
    },
    descText: {
      marginTop: 10,
      fontFamily: "Lato_400Regular",
      color: theme.text,
      fontSize: 15,
    },
    inputBox: {
      borderWidth: 0.8,
      height: 40,
      marginVertical: 10,
      marginBottom: 20,
      borderColor: theme.blackText,
      color: theme.blackText,
    },
    editBtn: {
      backgroundColor: theme.text,
      padding: 8,
      borderRadius: 6,
      alignItems: "center",
      alignSelf: "flex-end",
      width: 80,
      height: 40,
      justifyContent: "center",
      marginTop: 10,
    },
    editBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
    },
  });
  return submissionStyles;
};
