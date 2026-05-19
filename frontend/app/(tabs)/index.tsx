import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RankingCard from "@/components/ui/ranking-card";
import { useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getStudentDetail } from "@/services/student/student";
import { useAppContext } from "@/context/AppContext";
import { editTeam, getTeamDetail } from "@/services/team/team";
import { router } from "expo-router";
import { toast } from "sonner-native";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { socket } from "@/services/socket";
import {
  ActivityRankDetail,
  GlobalRankDetail,
} from "@/services/summary/summary.type";
import { getActivityRank, getGlobalRank } from "@/services/summary/summary";
import QRCode from "react-native-qrcode-svg";

const colors = ["#6FB3B8", "#B86F6F", "#AEB86F", "#B86FAF"];

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { user, setUser, team, setTeam } = useAppContext();

  const rankings = [1, 2, 3, 4, 5, 6, 7];
  const [results, setResults] = useState<
    (ActivityRankDetail | GlobalRankDetail | undefined)[]
  >([]);

  const scrollRef = useRef<ScrollView>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [carouselMembers, setCarouselMembers] = useState<string[]>([]);
  const [activeMembers, setActiveMembers] = useState<string[]>([]);

  const [teamName, setTeamName] = useState(team?.name);
  const [editingName, setEditingName] = useState(false);
  const [loadingEditName, setLoadingEditName] = useState(false);

  const [loading, setLoading] = useState(false);
  const defaultLogo =
    "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";
  const hasJoinedRef = useRef(false);

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

  const checkTeam = async () => {
    const userResponse = await getStudentDetail();
    if (!userResponse.success) {
      toast.error(userResponse.message);
      return;
    }
    setUser(userResponse.data);

    if (!userResponse.data?.teamId) {
      router.push("/(auth)/team_confirmation");
    } else {
      setLoading(true);
      const teamId = userResponse.data.teamId;
      await fetchTeamDetail(teamId);

      const fetches = Array.from({ length: 7 }, (_, i) => {
        const type = (i + 1).toString();
        return fetchActivityRank(teamId, type);
      });

      const globalRes = await fetchGlobalRank(teamId);
      const allResults = await Promise.all(fetches);

      setResults([globalRes, ...allResults]);
      setLoading(false);
    }
  };

  const fetchActivityRank = async (teamId: string, type?: string) => {
    if (type === undefined) return;

    try {
      const res = await getActivityRank({ activityId: type });
      if (!res.success) {
        toast.error("Failed to fetch leaderboard data");
      }

      for (let i = 0; i < res.rankings.length; i++) {
        if (res.rankings[i].teamId === teamId) {
          return res.rankings[i];
        }
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const fetchGlobalRank = async (teamId: string) => {
    try {
      const res = await getGlobalRank();
      if (!res.success) {
        toast.error("Failed to fetch leaderboard data");
      }

      for (let i = 0; i < res.rankings.length; i++) {
        if (res.rankings[i].teamId === teamId) {
          return res.rankings[i];
        }
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const fetchTeamDetail = async (id: string) => {
    const teamResponse = await getTeamDetail(id);
    if (!teamResponse.success) {
      toast.error(teamResponse.message);
      return;
    }
    setTeam(teamResponse.team);
    if (teamResponse.team !== null)
      setCarouselMembers(teamResponse.team.members.map((t, _) => t.firstName));
    hasJoinedRef.current = false;
  };

  const handleEditName = async () => {
    if (!team?.id || !teamName || !team.logo || loadingEditName) return;

    setLoadingEditName(true);

    const response = await editTeam({
      teamId: team.id,
      name: teamName,
      logoUrl: team.logo,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }

    await fetchTeamDetail(team.id);
    setEditingName(false);
    setLoadingEditName(false);
  };

  const handleEditLogo = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.fileName || "upload.jpg",
        type: asset.mimeType || "image/jpeg",
      };

      if (!team?.id || !team?.name || !team.logo) return;

      const response = await editTeam({
        teamId: team.id,
        name: team.name,
        logoUrl: team.logo,
        file: file,
      });
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      await fetchTeamDetail(team.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.id || !team?.id) {
      console.log("not complete", user, team);
      return;
    }

    const tryJoin = () => {
      if (hasJoinedRef.current) return;

      if (!socket.connected) {
        console.log("⏳ socket not ready");
      }

      console.log("🔥 JOINING TEAM");

      socket.emit("join_team", {
        teamId: team.id,
        user: {
          userId: user.id,
          name: user.firstName,
        },
      });

      hasJoinedRef.current = true;
      console.log("🎉 socket is ready");
    };

    // try immediately
    tryJoin();

    // also retry when socket connects
    socket.on("connect", tryJoin);

    return () => {
      socket.off("connect", tryJoin);
    };
  }, [user?.id, team?.id]);

  useEffect(() => {
    const handleActiveUsers = ({ teamId, users }: any) => {
      console.log("users", users);

      let names = users.map((u: any) => u.name);
      setMembers(names);

      if (!names.includes(user?.firstName)) {
        names.push(user?.firstName);
      }

      setActiveMembers([...names]);
    };

    console.log("is socket connected?", socket.connected);
    // LISTENER FIRST
    socket.on("team_active_users", handleActiveUsers);

    // THEN EMIT
    socket.emit("get_team_active_users", {
      teamId: team?.id,
    });

    return () => {
      socket.off("team_active_users", handleActiveUsers);
    };
  }, [team?.id, user?.firstName]);

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      {/* HEADER */}
      <ImageBackground
        source={require("../../assets/images/header2.jpg")}
        style={styles.header}
        imageStyle={{ opacity: 1.0 }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoApp}
        ></Image>

        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Welcome, {user?.firstName}!</Text>

          <Text style={styles.subtitle}>Team members:</Text>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.members}
          >
            {carouselMembers.map((name, i) => (
              <View key={i} style={styles.avatarContainer}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: colors[i % colors.length] },
                  ]}
                >
                  <Text style={styles.avatarText}>{name[0]}</Text>

                  {activeMembers.includes(name) && (
                    <View style={styles.onlineDot} />
                  )}
                </View>
                <Text style={styles.memberName}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* TEAM INFO */}
        <View style={{ marginBottom: 5 }}>
          <QRCode value={team?.id} size={100} />
        </View>

        <Text style={styles.label}>Team ID: {team?.id}</Text>

        <Text style={styles.label}>Team Class Grade: {team?.grade}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Team Name:</Text>

          <View style={styles.editRow}>
            <>
              <Text style={styles.teamName}>{team?.name}</Text>

              <Ionicons
                name="pencil"
                size={18}
                color={theme.text}
                onPress={() => setEditingName(true)}
              />
            </>
          </View>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.label}>Team Logo:</Text>

          <TouchableOpacity style={styles.logoWrapper}>
            <Image
              source={{
                uri: team?.logo,
              }}
              style={styles.logo}
            />

            <Ionicons
              name="pencil"
              size={20}
              style={styles.editIcon}
              onPress={handleEditLogo}
            />
          </TouchableOpacity>
        </View>

        {/* GLOBAL RANKING */}
        <Text style={styles.section}>Global Ranking:</Text>
        <RankingCard
          rank={results[0]?.rank?.toString() || "-"}
          score={results[0] ? `${Math.round(results[0].score * 100)}%` : "-"}
          teamName={team?.name || "-"}
          imageUrl={team?.logo || defaultLogo}
        />

        {rankings.map((item) => (
          <View key={item}>
            <Text style={styles.section}>Highest Ranking Activity {item}:</Text>

            <RankingCard
              rank={results[item]?.rank?.toString() || "-"}
              score={
                results[item]
                  ? `${Math.round(results[item].score * 100)}%`
                  : "-"
              }
              teamName={team?.name || "-"}
              imageUrl={team?.logo || defaultLogo}
              attemptNo={
                results[item] && "attemptNo" in results[item]
                  ? results[item].attemptNo.toString()
                  : undefined
              }
            />
          </View>
        ))}

        <Modal visible={editingName} transparent animationType="fade">
          <View style={styles.overlayPopup}>
            <View style={styles.popup}>
              {/* Header */}
              <View style={styles.headerPopup}>
                <Text style={styles.title}>Team Name</Text>

                <TouchableOpacity
                  onPress={() => {
                    setTeamName(team?.name);
                    setEditingName(false);
                  }}
                >
                  <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Enter your team name"
                placeholderTextColor={theme.placeholderText}
                value={teamName}
                onChangeText={setTeamName}
                style={styles.input}
              />

              {/* OK Button */}
              <Button
                fontSize={16}
                marginTop={10}
                width={150}
                text="OK"
                onPress={handleEditName}
                isLoading={loadingEditName}
              />
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
      fontFamily: "Nunito_700Bold",
    },
    subtitle: {
      color: "white",
      marginTop: 10,
      fontSize: 18,
      fontFamily: "Lato_400Regular",
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
      color: theme.blackText,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
    },

    editRow: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
      marginTop: -20,
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
      color: theme.text,
    },

    section: {
      fontFamily: "Lato_400Regular",
      fontSize: 18,
      marginTop: 30,
      marginBottom: 10,
      color: theme.blackText,
    },

    logoApp: {
      position: "absolute",
      top: 10,
      right: 25,
      width: 40,
      height: 60,
      resizeMode: "contain",
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
      elevation: 6,
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
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 16,
      paddingVertical: 8,
      fontFamily: "Lato_400Regular",
      marginTop: 2,
      color: theme.blackText,
    },
    onlineDot: {
      position: "absolute",
      right: 0,
      bottom: 0,

      width: 12,
      height: 12,
      borderRadius: 6,

      backgroundColor: "limegreen",

      borderWidth: 2,
      borderColor: "white",
    },
  });
  return styles;
};
