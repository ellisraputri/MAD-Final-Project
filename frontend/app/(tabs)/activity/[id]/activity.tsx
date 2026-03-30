import ActivityOneScreen from '@/components/activity1'
import ActivityTwoScreen from '@/components/activity2';
import ActivityThreeScreen from '@/components/activity3';
import ActivityFourScreen from '@/components/activity4';
import ActivityFiveScreen from '@/components/activity5';
import ActivitySixScreen from '@/components/activity6'
import ActivitySevenScreen from '@/components/activity7';
import { useAppContext } from '@/context/AppContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { socket } from '@/services/socket';
import { router, useGlobalSearchParams } from 'expo-router';
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ActivityScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {id} = useGlobalSearchParams();
  const {team} = useAppContext();

  useFocusEffect(
    useCallback(() => {
      if (!team?.members) return;

      if (id !== "6" && id !== "7") return;

      socket.emit("get_team_active_users", {
        teamId: team.id,
      });

      const handler = ({ users }: any) => {
        const isAllOnline = team.members.length === users.length;

        if (!isAllOnline) {
          alert("All team members must be online to start this activity.");
          router.push(`/(tabs)/activity/${id}/instructions`);
        }
      };

      socket.on("team_active_users", handler);

      return () => {
        socket.off("team_active_users", handler);
      };
    }, [id, team])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {Number(id)===1 && <ActivityOneScreen/>} 
      {Number(id)===2 && <ActivityTwoScreen/>}
      {Number(id)===3 && <ActivityThreeScreen/>} 
      {Number(id)===4 && <ActivityFourScreen/>} 
      {Number(id)===5 && <ActivityFiveScreen/>} 
      {Number(id)===6 && <ActivitySixScreen/>} 
      {Number(id)===7 && <ActivitySevenScreen/>}
    </ScrollView>
  )
}

const createStyles = (theme:any) => {
  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: theme.background,
      paddingHorizontal: 30,
    }
  })
  return styles;
}