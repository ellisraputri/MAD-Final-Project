import ActivityOneScreen from '@/components/ui/activity1'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      <Text>Hi mega </Text>
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