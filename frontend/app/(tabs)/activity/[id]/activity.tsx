import ActivityOneScreen from '@/components/activity1'
import ActivityTwoScreen from '@/components/activity2';
import ActivityThreeScreen from '@/components/activity3';
import ActivityFourScreen from '@/components/activity4';
import ActivityFiveScreen from '@/components/activity5';
import ActivitySixScreen from '@/components/activity6'
import ActivitySevenScreen from '@/components/activity7';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {id} = useGlobalSearchParams();

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