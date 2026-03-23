import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity, Animated, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RankingCard from "@/components/ui/ranking-card";
import { useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getStudentDetail } from "@/services/student/student";
import { router } from "expo-router";

const colors = ["#6FB3B8", "#B86F6F", "#AEB86F", "#B86FAF"]

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const rankings = [1,2,3,4,5,6,7];
  const scrollRef = useRef<ScrollView>(null);
  const members = ["Ellis","Ella","Ello","Ellu"];
  const carouselMembers = [...members, ...members];

  const [teamName, setTeamName] = useState("Kita Menang Yey");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let position = 0;

    const itemWidth = 30; // width of avatar + margin
    const loopWidth = members.length * itemWidth;

    const interval = setInterval(() => {
      position += 1;

      if (position >= loopWidth) {
        position = 0;
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      } else {
        scrollRef.current?.scrollTo({
          x: position,
          animated: false,
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkTeam();
  }, []);
  
  const checkTeam = async() => {
    const response = await getStudentDetail();
    if(response.user?.teamId === null) {
      // TODO: fetch team detail 
      router.push("/(auth)/team_confirmation");
    }
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <ImageBackground
        source={require("../../assets/images/header2.jpg")}
        style={styles.header}
        imageStyle={{opacity: 1.0}}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoApp}
        >
        </Image>

        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Welcome, Ellis!</Text>

          <Text style={styles.subtitle}>Online team members:</Text>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.members}
          >
            {carouselMembers.map((name, i) => (
              <View key={i} style={styles.avatarContainer}>
                <View style={[styles.avatar, {backgroundColor: colors[i % colors.length]}]}>
                  <Text style={styles.avatarText}>{name[0]}</Text>
                </View>
                <Text style={styles.memberName}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>

      {/* CONTENT */}
      <ScrollView style={styles.content}  contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* TEAM INFO */}
        <Text style={styles.label}>Team ID: gyh6fg</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Team Name:</Text>

          <View style={styles.editRow}>
            <>
              <Text style={styles.teamName}>{teamName}</Text>

              <Ionicons
                name="pencil"
                size={18}
                color={theme.text}
                onPress={() => setEditing(true)}
              />
            </>
          </View>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.label}>Team Logo:</Text>

          <TouchableOpacity style={styles.logoWrapper}>
            <Image
              source={{
                uri: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
              }}
              style={styles.logo}
            />

            <Ionicons
              name="pencil"
              size={20}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* GLOBAL RANKING */}
        <Text style={styles.section}>Global Ranking:</Text>
        <RankingCard 
          rank="1"
          score="100%"
          teamName="Kita Menang Yey"
          imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
        />

        {rankings.map((item) => (
          <View key={item}>
            <Text style={styles.section}>
              Highest Ranking Activity {item}:
            </Text>

            <RankingCard 
              rank="1"
              score="100%"
              teamName="Kita Menang Yey"
              imageUrl="https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/456e/live/08bb1170-3f6c-11ef-abf4-9dcdb3140a6f.jpg"
            />
          </View>
        ))}


        <Modal
          visible={editing}
          transparent
          animationType="fade"
        >
          <View style={styles.overlayPopup}>
            <View style={styles.popup}>
              
              {/* Header */}
              <View style={styles.headerPopup}>
                <Text style={styles.title}>Team Name</Text>
  
                <TouchableOpacity onPress={() => setEditing(false)}>
                  <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
              </View>
  
              <TextInput
                  placeholder="Enter your team ID"
                  placeholderTextColor={theme.placeholderText}
                  value={teamName}
                  onChangeText={setTeamName}
                  style={styles.input}
              />
  
              {/* OK Button */}
              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.buttonPopup}>
                      <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
              </View>
  
            </View>
          </View>
        </Modal>

      </ScrollView>

    </View>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 250,
      padding: 20,
    },
    headerContent: {
      marginBottom: 10,
    },
    welcome: {
      fontSize: 28,
      color: "white",
      marginTop: 40,
      fontFamily: "Nunito_700Bold"
    },
    subtitle: {
      color: "white",
      marginTop: 10,
      fontSize: 18,
      fontFamily: "Lato_400Regular"
    },
    members: {
      marginTop: 15,
      paddingRight: 20,
    },
    avatarContainer: {
      alignItems: "center",
      marginRight: 20,
    },

    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    avatarText: {
      color: "white",
      fontWeight: "bold",
    },

    memberName: {
      color: "white",
      fontFamily: "Lato_400Regular",
      marginTop: 5,
      fontSize: 12,
    },

    content: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      marginTop: -20,
    },

    label: {
      fontSize: 18,
      fontFamily: "Lato_400Regular", 
      marginBottom: 20,
      color: theme.blackText
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
    },

    editRow: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
      marginTop: -20
    },

    teamName: {
      fontSize: 18,
      color: theme.blackText,
      marginRight: 5,
      borderBottomWidth: 2,
      borderBottomColor: theme.text,
    },

    logoContainer: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
    },

    logoWrapper: {
      marginLeft: 10,
      position: "relative",
    },

    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },

    editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 2,
      elevation: 3,
      color: theme.text
    },

    section: {
      fontFamily: "Lato_400Regular",
      fontSize: 18,
      marginTop: 30,
      marginBottom: 10,
      color: theme.blackText
    },

    logoApp: {
      position: 'absolute',
      top: 10,
      right: 25,
      width: 40,
      height: 60,
      resizeMode: 'contain',
    },

    teamInput: {
      borderBottomWidth: 2, 
      borderColor: theme.text,
      minWidth: 120,
      marginRight: 10,
      fontSize: 16,
      fontFamily: "Lato_400Regular",
    },
    popup: {
      width: "85%",
      backgroundColor: theme.background,
      borderRadius: 25,
      padding: 24,
      elevation: 6
    },
    headerPopup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    title: {
      fontSize: 22,
      color: theme.text,
      fontWeight: "600",
      fontFamily: "Nunito_700Bold",
    },
    close: {
      fontSize: 28,
      color: theme.blackText, 
    },
    overlayPopup: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonPopup: {
      marginTop: 20,
      borderWidth: 2,
      borderColor: theme.text,
      borderRadius: 50,
      paddingVertical: 6,
      alignItems: 'center',
      width: 150,
    },
    buttonText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
      fontFamily: "Nunito_700Bold",
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 16,
      paddingVertical: 8,
      fontFamily: 'Lato_400Regular',
      marginTop: 2,
      color: theme.blackText, 
    },
  });
  return styles;
}