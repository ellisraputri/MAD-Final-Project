import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import VideoPlayer from '@/components/ui/video-player';
import theoryActivity from '@/data/activity_theory.json';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/button';

function Section({title, children}: {title: string, children: React.ReactNode}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider}/>
      {children}
    </View>
  );
}

function ActivityOneResultCard(props: {
    item: number; 
    videoUri: string | null;
    mass: number;
    timePredict: number;
    timeCalculated: number;
}){
    const [showVideoModal, setShowVideoModal] = useState(false);

    return(
        <View key={props.item} style={resultStyles.card}>
          <View style={resultStyles.titleRow}>
            <Text style={resultStyles.title}>
                {props.item}. Submission {props.item}
            </Text>
        </View>

        <View style={resultStyles.subsContainer}>
            <View style={resultStyles.videoPlaceholder}>
                {props.videoUri ? (
                    <>
                        <TouchableOpacity
                        style={resultStyles.playOverlay}
                        onPress={() => setShowVideoModal(true)}
                        >
                        <Ionicons name="play-circle" size={60} color="#357D89" />
                        <Text style={resultStyles.tapText}>Tap to play</Text>
                        </TouchableOpacity>

                        <Modal visible={showVideoModal} animationType="slide" transparent={false}>
                            <View style={resultStyles.fullscreenModal}>
                                <VideoPlayer link={props.videoUri} vidHeight={400} vidWidth={320} />
                                <TouchableOpacity
                                style={resultStyles.closeVideoBtn}
                                onPress={() => setShowVideoModal(false)}
                                >
                                <Text style={resultStyles.closeBtnText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </>
                ) : (
                    <Text style={resultStyles.descText}>No video</Text>
                )}
            </View>

            <Text style={resultStyles.subtitleText}>Mass of toy (gram): {props.mass} </Text>

            <Text style={resultStyles.subtitleText}>
                Time to hit ground (seconds)
            </Text>
            <View style={resultStyles.list}>
                <Text style={resultStyles.listItem}>
                    • Predicted: {props.timePredict}
                </Text>
                <Text style={resultStyles.listItem}>
                    • Outcome: {props.timeCalculated}
                </Text>
            </View>

            <Text style={resultStyles.descText}>This is the results of calculation..</Text>
        </View>
        </View>
    )
}

const data = [
    {
        "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "mass": 100,
        "predicted": 20,
        "outcome": 10,
    },
    {
        "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "mass": 100,
        "predicted": 20,
        "outcome": 10,
    },
    {
        "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "mass": 100,
        "predicted": 20,
        "outcome": 10,
    }
]

export default function ActivityOneResultsScreen(props: {onBack: ()=>void}) {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Theory */}
      <Section title="Theory">
        <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory1"]}</Text>
      </Section>

      {/* Results */}
      <Section title="Results">
        {data?.map((d, idx) => (
          <ActivityOneResultCard 
            key={idx}
            item={idx+1} mass={d.mass} videoUri={d.uri}
            timeCalculated={d.outcome} timePredict={d.predicted} 
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

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    paddingHorizontal: 5,
  },

  sectionTitle:{
    fontSize:20,
    fontWeight:"600",
    color:"#357D89",
    fontFamily: "Lato_700Bold",
  },

  divider:{
    height:2,
    backgroundColor:"#388087",
    marginVertical:10
  },

  paragraph:{
    fontSize:15,
    lineHeight:22,
    textAlign: "justify",
    fontFamily: "Lato_400Regular",
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
  },
  text: {
    flexShrink: 1, 
    fontFamily: "Lato_400Regular",
    lineHeight:20,
    fontSize: 15,
  },

  videoBox:{
    height:160,
    backgroundColor:"#CFCFCF",
    justifyContent:"center",
    alignItems:"center"
  },
});

const resultStyles = StyleSheet.create({
    playOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tapText: {
        marginTop: 8,
        color: '#357D89',
        fontFamily: "Lato_400Regular",
        fontSize: 20,
    },
    fullscreenModal: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeVideoBtn: {
        position: 'absolute',
        bottom: 80, 
        backgroundColor: "#388087",
        padding: 10,
        borderRadius: 8,
        width: 120,
        alignItems: 'center',
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
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
    },
    title: {
        marginBottom: 20,
        fontFamily: "Lato_700Bold",
        color: '#357D89',
        fontSize: 20
    },
    videoPlaceholder: {
        height: 400,
        width: '100%',
        borderWidth: 2,
        borderColor: '#357D89',
        backgroundColor: "#d9d9d9",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        overflow: 'hidden'
    },
    prediction: {
        marginTop: 15,
        fontFamily: "Lato_700Bold",
        color: '#357D89',
        fontSize: 18
    },
    subtitleText:{
        marginTop: 10,
        fontFamily: "Lato_700Bold",
        fontSize: 16
    },
    descText:{
        marginTop: 10,
        fontFamily: "Lato_400Regular",
        fontSize: 15
    },
    closeBtnText: {
        color: "#fff",
        fontFamily: "Lato_400Regular",
        fontSize: 14
    },
    list: {
        marginLeft: 10,
        marginTop: 4,
    },
    listItem: {
        fontSize: 15,
        fontFamily: "Lato_400Regular",
        marginBottom: 5,
    }
});