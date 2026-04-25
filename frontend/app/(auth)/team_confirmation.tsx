import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Polygon } from 'react-native-svg';
import CustomDropdown from '@/components/ui/dropdown';
import Button from '@/components/ui/button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getStudentDetail } from '@/services/student/student';
import { useAppContext } from '@/context/AppContext';
import { createTeam, getTeamDetail, joinTeam } from '@/services/team/team';
import { toast } from 'sonner-native';

const gradeDropdown = [
  {label: "1 (SD Kelas 1)", value: "1"},
  {label: "2 (SD Kelas 2)", value: "2"},
  {label: "3 (SD Kelas 3)", value: "3"},
  {label: "4 (SD Kelas 4)", value: "4"},
  {label: "5 (SD Kelas 5)", value: "5"},
  {label: "6 (SD Kelas 6)", value: "6"},
  {label: "7 (SMP Kelas 1)", value: "7"},
  {label: "8 (SMP Kelas 2)", value: "8"},
  {label: "9 (SMP Kelas 3)", value: "9"},
  {label: "10 (SMA Kelas 1)", value: "10"},
  {label: "11 (SMA Kelas 2)", value: "11"},
  {label: "12 (SMA Kelas 3)", value: "12"},
]

export default function TeamConfirmationScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {setUser} = useAppContext();
  const params = useLocalSearchParams();

  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [grade, setGrade] = useState("");
  const [teamId, setTeamId] = useState("");
  const [newTeamModalVisible, setNewTeamModalVisible] = useState(false);
  const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);
  const [newTeamModalLoading, setNewTeamModalLoading] = useState(false);
  const [joinTeamModalLoading, setJoinTeamModalLoading] = useState(false);

  useEffect(() => {
    checkTeam();
  }, []);

  const checkTeam = async() => {
    const userResponse = await getStudentDetail();
    if(!userResponse.success){
      toast.error(userResponse.message)
      return;
    }
    setUser(userResponse.data);
    console.log(userResponse);

    if(userResponse.data?.teamId !== null && userResponse.data?.teamId) {
      router.push("/(tabs)");
    }
  }

  const handleCreateTeam = async() => {
    if(newTeamModalLoading) return;

    setNewTeamModalLoading(true);

    const response = await createTeam({
      name: teamName, grade: Number(grade)
    })
    if(!response.success) {
      toast.error(response.message)
      setNewTeamModalLoading(false);
      return;
    }
    
    setNewTeamModalLoading(false);
    setNewTeamModalVisible(false);

    router.push("/(tabs)");
  }

  useEffect(() => {
    const joinTeamFromQR = async () => {
      if (params.scannedTeamId) {
        const scannedId = String(params.scannedTeamId);

        setTeamId(scannedId);
        await handleJoinTeam(scannedId);
      }
    };

    joinTeamFromQR();
  }, [params.scannedTeamId]);

  const handleJoinTeam = async (customTeamId?: string) => {
    if (joinTeamModalLoading) return;

    setJoinTeamModalLoading(true);

    const response = await joinTeam({
      teamId: customTeamId || teamId,
    });

    if (!response.success) {
      toast.error(response.message);
      setJoinTeamModalLoading(false);
      return;
    }

    setJoinTeamModalLoading(false);
    setJoinTeamModalVisible(false);

    router.push("/(tabs)");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      {/* Header Image */}
      <ImageBackground
        source={require('../../assets/images/header.png')}
        style={styles.header}
        resizeMode="cover"
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        >
        </Image>

        <Image
          source={require("../../assets/images/text_logo.png")}
          style={styles.textLogo}
        >
        </Image>

        <View style={styles.overlay}>
          <Text style={styles.subtitle}>
            Simulate Reality. Sense the Science
          </Text>
        </View>

        <Svg
          height="80"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={styles.diagonal}
        >
          <Polygon
            points="0,60 0,65 0,70 0,75 2,79 3,80 4,79 100,0 100,100 0,100"
            fill={theme.background}
          />
        </Svg>

      </ImageBackground>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.text}>Looks like you're not part of a team yet!</Text>
        <Text style={styles.text}>Create one or join a team to jump into the fun 🚀✨</Text>
        
        <Button
          onPress={() => setNewTeamModalVisible(true)}
          text='Create New Team'
          width={300}
          fontSize={20}
          marginTop={50}
        />

        <Button
          onPress={() => setJoinTeamModalVisible(true)}
          text='Join a Team'
          width={300}
          fontSize={20}
          marginTop={10}
        />
      </View>

      <Modal
        visible={newTeamModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.overlayPopup}>
          <View style={styles.popup}>
            
            {/* Header */}
            <View style={styles.headerPopup}>
              <Text style={styles.title}>Create New Team</Text>

              <TouchableOpacity onPress={() => setNewTeamModalVisible(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Team Name */}
            <Text style={styles.label}>Team Name</Text>
            <TextInput
                placeholder="Enter your team name"
                placeholderTextColor={theme.placeholderText}
                value={teamName}
                onChangeText={setTeamName}
                style={styles.input}
            />

            {/* Grade dropdown placeholder */}
            <Text style={styles.label}>Grade</Text>
            <CustomDropdown data={gradeDropdown} value={grade} placeholder='Select grade' onSelect={setGrade}/>

            {/* OK Button */}
            <Button
              onPress={handleCreateTeam}
              text='OK'
              width={150}
              fontSize={20}
              marginTop={30}
              isLoading={newTeamModalLoading}
            />

          </View>
        </View>
      </Modal>

      <Modal
        visible={joinTeamModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.overlayPopup}>
          <View style={styles.popup}>
            
            {/* Header */}
            <View style={styles.headerPopup}>
              <Text style={styles.title}>Join Team</Text>

              <TouchableOpacity onPress={() => setJoinTeamModalVisible(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Team ID</Text>
            <TextInput
                placeholder="Enter your team ID"
                placeholderTextColor={theme.placeholderText}
                value={teamId}
                onChangeText={setTeamId}
                style={styles.input}
            />

            <Button
              text="Scan QR Code"
              onPress={() => router.push("/(auth)/scan_team")}
              width={200}
              marginTop={20}
              fontSize={20}
            />

            {/* OK Button */}
            <Button
              onPress={handleJoinTeam}
              text='OK'
              width={150}
              fontSize={20}
              marginTop={30}
              isLoading={joinTeamModalLoading}
            />

          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      height: 300,
      justifyContent: 'flex-end',
    },
    form: {
      flex: 1,
      padding: 24,
      backgroundColor: theme.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -18,
    },
    label: {
      fontSize: 16,
      color: theme.text,
      fontFamily: 'Nunito_700Bold',
      marginTop: 20,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontSize: 16,
      paddingVertical: 8,
      fontFamily: 'Lato_400Regular',
      marginTop: 2,
      color: theme.blackText
    },
    text: {
      fontSize: 20,
      color: theme.text,
      lineHeight: 32,
      fontFamily: "Lato_400Regular",
    },
    diagonal: {
      position: 'absolute',
      bottom: -1,
      width: '100%',
    },
    logo: {
      position: 'absolute',
      top: 60,
      left: 15,
      width: 60,
      height: 80,
      resizeMode: 'contain',
    },
    textLogo: {
      position: 'absolute',
      top: 150,
      left: 20,
      width: 180,
      height: 50,
      resizeMode: 'contain',
    },
    overlay: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 20,
      padding: 20,
    },
    subtitle: {
      color: '#fff',
      fontSize: 18,
      fontFamily: "Lato_700Bold",
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
    },
    title: {
      fontSize: 24,
      color: theme.text,
      fontWeight: "600",
      fontFamily: "Nunito_700Bold",
    },
    close: {
      fontSize: 28,
      color: theme.blackText
    },
    overlayPopup: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return styles;
}