import { StyleSheet } from "react-native";

export const createMainActivityStyles = (theme: any) => {
  const styles = StyleSheet.create({
    closeButton: {
      position: "absolute",
      top: 10,
      right: 15,
      zIndex: 10,
      padding: 8,
    },

    buttonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      marginTop: 40,
    },

    timer: {
      fontSize: 28,
      color: theme.text,
      fontFamily: "Lato_700Bold",
      marginBottom: 25,
      marginTop: 5,
    },

    circle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: "#BADFE7",
      justifyContent: "center",
      alignItems: "center",
    },
    circleText: {
      fontSize: 32,
      color: "#357D89",
      fontFamily: "Lato_400Regular",
      textAlign: "center",
      lineHeight: 45,
    },

    stopCircle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: "#F6F6F2",
      borderColor: "#badfe7",
      borderWidth: 5,
      justifyContent: "center",
      alignItems: "center",
    },

    recordButtonOuter: {
      width: 60,
      height: 60,
      borderRadius: 40,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },

    recordButtonInner: {
      width: 35,
      height: 35,
      borderRadius: 25,
      backgroundColor: "#c50000",
    },

    recordingInner: {
      width: 25,
      height: 25,
      borderRadius: 6,
      backgroundColor: "#c50000",
    },

    recordBtnArea: {
      backgroundColor: theme.hoverBackground,
      width: 320,
      alignItems: "center",
      paddingBottom: 15,
    },

    videoScreen: {
      width: 320,
      height: 500,
    },

    mainView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    modalContainer: {
      flex: 1,
      paddingTop: 30,
      paddingHorizontal: 5,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    scrollView: {
      alignItems: "center",
      paddingBottom: 40,
    },
    titleModalText: {
      marginTop: 20,
      marginBottom: 20,
      fontSize: 20,
      color: theme.text,
      fontWeight: "500",
      fontFamily: "Lato_700Bold",
    },
    titleText: {
      marginTop: 100,
      marginBottom: 20,
      fontSize: 20,
      color: theme.text,
      fontWeight: "500",
      fontFamily: "Lato_700Bold",
    },
    titleText45: {
      marginTop: 10,
      fontSize: 24,
      color: theme.text,
      fontWeight: "500",
      fontFamily: "Lato_700Bold",
    },
    subtitleText: {
      fontFamily: "Lato_400Regular",
      fontSize: 16,
      marginBottom: 60,
      color: theme.blackText,
    },
    buttonPopup: {
      marginTop: 30,
      borderWidth: 2,
      borderColor: theme.text,
      borderRadius: 50,
      paddingVertical: 8,
      alignItems: "center",
      width: 300,
      height: 53,
    },
    disabledBtn: {
      opacity: 0.4,
    },
    buttonText: {
      fontSize: 20,
      color: theme.text,
      fontWeight: "500",
      fontFamily: "Nunito_700Bold",
    },
    backBtn: {
      padding: 10,
      marginTop: 30,
      borderWidth: 2,
      borderColor: theme.text,
      borderRadius: 50,
      paddingVertical: 8,
      alignItems: "center",
      width: 260,
      height: 53,
    },

    btnText: {
      fontSize: 18,
      color: theme.text,
      fontWeight: "500",
      fontFamily: "Nunito_700Bold",
    },

    submitBtn: {
      marginTop: 30,
      marginBottom: 50,
      borderWidth: 2,
      padding: 10,
      borderRadius: 50,
      borderColor: theme.text,
      width: 150,
      alignItems: "center",
    },
    container: { flex: 1 },
    card: { borderRadius: 12, height: 300 },
    phase12: {
      backgroundColor: "#BADFE7",
      justifyContent: "center",
      alignItems: "center",
      borderColor: theme.text,
      borderWidth: 1,
    },
    phase3: {
      backgroundColor: "#BADFE7",
      borderWidth: 1,
      borderColor: theme.text,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      lineHeight: 28,
      marginBottom: 15,
    },
    startButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    stopButton: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.text,
      justifyContent: "center",
      alignItems: "center",
    },
    startText: {
      color: theme.darkText,
      fontSize: 20,
      fontFamily: "Lato_700Bold",
    },
    stopText: { color: "white", fontSize: 20, fontFamily: "Lato_700Bold" },
    readyText: {
      marginTop: 20,
      marginBottom: 20,
      fontFamily: "Lato_700Bold",
      color: theme.darkText,
      fontSize: 24,
    },

    cardTitle: {
      fontSize: 18,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 14,
    },

    cardSubtitle: {
      fontSize: 16,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 5,
    },

    cardLabel: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 5,
      fontFamily: "Lato_400Regular",
    },

    cardInputRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    cardInput: {
      width: 100,
      height: 40,
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      marginBottom: 15,
      fontFamily: "Lato_400Regular",
      fontSize: 16,
      color: theme.blackText,
    },

    cardUnit: {
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
      fontFamily: "Lato_400Regular",
    },

    cardContainer: {
      margin: 10,
      marginBottom: 20,
      padding: 20,
      elevation: 6,
      backgroundColor: theme.background,
      borderRadius: 10,
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
  return styles;
};
