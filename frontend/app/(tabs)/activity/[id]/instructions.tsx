import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import activity1Instructions from '@/data/activity1_instructions.json';
import activity2Instructions from '@/data/activity2_instructions.json';
import activity3Instructions from '@/data/activity3_instructions.json';
import activity4Instructions from '@/data/activity4_instructions.json';
import activity5Instructions from '@/data/activity5_instructions.json';
import activity6Instructions from '@/data/activity6_instructions.json';
import activity7Instructions from '@/data/activity7_instructions.json';
import { useLocalSearchParams } from 'expo-router';
import VideoPlayer from '@/components/ui/video-player';
import { useAppTheme } from '@/hooks/use-app-theme';

type InstructionImage = {
  image: string,
  caption: string 
}

type InstructionJson = {
  overview: string,
  equipments: InstructionImage[],
  tutorial: string[],
  video: string 
}

const instructionsMap: Record<number, InstructionJson> = {
  1: activity1Instructions,
  2: activity2Instructions,
  3: activity3Instructions,
  4: activity4Instructions,
  5: activity5Instructions,
  6: activity6Instructions,
  7: activity7Instructions
};

function Section({title, children}: {title: string, children: React.ReactNode}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider}/>
      {children}
    </View>
  );
}

function EquipmentCard({index, name, imageUrl}: {index: number, name: string, imageUrl: string}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.equipmentItem}>
      <Text style={styles.equipmentText}>
        {index}. {name}
      </Text>

      <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
    </View>
  );
}

export default function InstructionScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { id } = useLocalSearchParams();
  const data = instructionsMap[Number(id)];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>

      {/* Overview */}
      <Section title="Overview">
        <Text style={styles.paragraph}>{data?.overview}</Text>
      </Section>

      {/* Equipment */}
      <Section title="Equipment">
        <View style={styles.grid}>
          {data?.equipments.map((item, i) => (
            <EquipmentCard key={i} index={i+1} name={item.caption} imageUrl={item.image}/>
          ))}
        </View>
      </Section>

      {/* Instructions */}
      <Section title="Instructions">
        {data?.tutorial.map((step, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.marker}>{`${i + 1}.`}</Text>
            <Text style={styles.text}>{step}</Text>
          </View>
        ))}
      </Section>

      {/* Tutorial */}
      <Section title="Tutorial">
        <VideoPlayer link={data.video}/>
      </Section>

    </ScrollView>
  );
}

const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor: theme.background,
      paddingHorizontal: 30,
    },

    section:{
      marginBottom:30
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
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    grid:{
      flexDirection:"row",
      flexWrap:"wrap",
      justifyContent:"space-between"
    },

    equipmentItem:{
      width:"48%",
      marginBottom:20
    },

    equipmentText:{
      marginBottom:8,
      fontSize: 15,
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    item: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    marker: {
      marginRight: 10,
      fontWeight: 'bold',
      fontFamily: "Lato_400Regular",
      lineHeight:20,
      fontSize: 15,
      color: theme.blackText,
    },
    text: {
      flexShrink: 1, 
      fontFamily: "Lato_400Regular",
      lineHeight:20,
      fontSize: 15,
      color: theme.blackText,
    },

  });
  return styles;
}