import ActivityOneScreen from '@/components/activity1'
import ActivityThreeScreen from '@/components/activity3';
import ActivitySixScreen from '@/components/activity6'
import ActivitySevenScreen from '@/components/activity7';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  const {id} = useGlobalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {Number(id)===1 && <ActivityOneScreen/>} 
      {Number(id)===3 && <ActivityThreeScreen/>} 
      {Number(id)===6 && <ActivitySixScreen/>} 
      {Number(id)===7 && <ActivitySevenScreen/>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    paddingHorizontal: 30,
  }
})