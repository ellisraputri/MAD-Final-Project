import ActivityOneScreen from '@/components/activity1'
import ActivitySixScreen from '@/components/activity6'
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  const {id} = useGlobalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {Number(id)===6 && <ActivitySixScreen/>} 
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