import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import theoryActivity from '@/data/activity_theory.json';
import Button from './ui/button';
import AudioPlayer from './ui/audio-player';
import { useAppTheme } from '@/hooks/use-app-theme';

function Section({title, children}: {title: string, children: React.ReactNode}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider}/>
      {children}
    </View>
  );
}

function ActivityFourResultCard(props: {
    item: number; 
    vibrateTime: number;
    valuePredict: number;
    valueCalculated: number;
}){
  const theme = useAppTheme();
  const resultStyles = createStyles(theme);
    return(
        <View key={props.item} style={[resultStyles.card, {borderWidth:1, borderColor: "white"}]}>
          <View style={resultStyles.titleRow}>
            <Text style={resultStyles.title}>
                Vibration {props.item}: {props.vibrateTime}s
            </Text>
          </View>

          <View style={resultStyles.list}>
              <Text style={resultStyles.listItem}>
                  • Predicted: {props.valuePredict}
              </Text>
              <Text style={resultStyles.listItem}>
                  • Outcome: {props.valueCalculated}
              </Text>
          </View>

          <Text style={resultStyles.descText}>This is the results of calculation..</Text>
        </View>
    )
}

const data = [
    {
        "predicted": 20,
        "outcome": 10,
        "vibrationTime": 100
    },
    {
        "predicted": 20,
        "outcome": 10,
        "vibrationTime": 100
    },
    {
        "predicted": 20,
        "outcome": 10,
        "vibrationTime": 100
    }
]

export default function ActivityFourResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Theory */}
      <Section title="Theory">
        <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory4"]}</Text>
      </Section>

      {/* Results */}
      <Section title="Results">
        {data?.map((d, idx) => (
          <ActivityFourResultCard 
            key={idx}
            item={idx+1} vibrateTime={d.vibrationTime}
            valueCalculated={d.outcome} valuePredict={d.predicted} 
            />
        ))}
      </Section>

      <Button 
        width={250} onPress={()=>alert("see leaderboard")}
        fontSize={20} marginTop={5} text='See Leaderboard'
      />
      <Button 
        width={250} onPress={props.onBack}
        fontSize={20} marginTop={5} text='Back'
      />

    </ScrollView>
  );
}

const createStyles = (theme:any) => {
  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: theme.background,
      paddingHorizontal: 5,
    },

    sectionTitle:{
      fontSize:20,
      fontWeight:"600",
      color: theme.text,
      fontFamily: "Lato_700Bold",
    },

    divider:{
      height:2,
      backgroundColor: theme.text,
      marginVertical:10
    },

    paragraph:{
      fontSize:15,
      lineHeight:22,
      textAlign: "justify",
      color: theme.blackText,
      fontFamily: "Lato_400Regular",
    },

    subsContainer:{
        marginLeft: 20,
    },
    titleRow:{
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '100%',
        backgroundColor: theme.background,
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
    },
    title: {
        marginBottom: 10,
        fontFamily: "Lato_700Bold",
        color: theme.text,
        fontSize: 20
    },
    prediction: {
        marginTop: 15,
        fontFamily: "Lato_700Bold",
        color: theme.text,
        fontSize: 18
    },
    subtitleText:{
        marginTop: 10,
        fontFamily: "Lato_700Bold",
        fontSize: 16,
        color: theme.blackText,
    },
    descText:{
        marginTop: 10,
        fontFamily: "Lato_400Regular",
        fontSize: 15,
        color: theme.blackText,
    },
    list: {
        marginLeft: 10,
        marginTop: 4,
    },
    listItem: {
        fontSize: 15,
        fontFamily: "Lato_400Regular",
        marginBottom: 5,
        color: theme.blackText,
    }
  });

  return styles;
}
