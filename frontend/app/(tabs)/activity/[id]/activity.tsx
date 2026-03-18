import ActivityOneScreen from '@/components/ui/activity1'
import ActivityThreeScreen from '@/components/ui/activity3'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 30, paddingBottom: 100 }}>
      <ActivityThreeScreen/>
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