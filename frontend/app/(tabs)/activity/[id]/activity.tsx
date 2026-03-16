import ActivityOneScreen from '@/components/ui/activity-one'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 30, paddingBottom: 100 }}>
      <ActivityOneScreen/>
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