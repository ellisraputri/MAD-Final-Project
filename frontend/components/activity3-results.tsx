import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import VideoPlayer from '@/components/ui/video-player';
import theoryActivity from '@/data/activity_theory.json';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/button';
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

function ActivityThreeResultCard(props: {
    item: number; 
    videoUri: string | null;
    timePredict: number;
    timeCalculated: number;
}){
    const theme = useAppTheme();
    const resultStyles = createStyles(theme);

    const [showVideoModal, setShowVideoModal] = useState(false);

    return(
        <View key={props.item} style={[resultStyles.card, {borderColor:"white", borderWidth:1}]}>
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
        "predicted": 20,
        "outcome": 10,
    },
    {
        "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "predicted": 20,
        "outcome": 10,
    },
    {
        "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "predicted": 20,
        "outcome": 10,
    }
]

export default function ActivityThreeResultsScreen(props: {onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Theory */}
      <Section title="Theory">
        <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory3"]}</Text>
      </Section>

      {/* Results */}
      <Section title="Results">
        {data?.map((d, idx) => (
          <ActivityThreeResultCard 
            key={idx}
            item={idx+1} videoUri={d.uri}
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

const createStyles = (theme: any) => {
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
      fontFamily: "Lato_400Regular",
      color: theme.blackText
    },

    grid:{
      flexDirection:"row",
      flexWrap:"wrap",
      justifyContent:"space-between"
    },

    playOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tapText: {
        marginTop: 8,
        color: theme.text,
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
        backgroundColor: theme.text,
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
        backgroundColor: theme.background,
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        elevation: 3,
    },
    title: {
        marginBottom: 20,
        fontFamily: "Lato_700Bold",
        color: theme.text,
        fontSize: 20
    },
    videoPlaceholder: {
        height: 400,
        width: '100%',
        borderWidth: 2,
        borderColor: theme.text,
        backgroundColor: theme.hoverBackground,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        overflow: 'hidden'
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
        color: theme.blackText
    },
    descText:{
        marginTop: 10,
        fontFamily: "Lato_400Regular",
        fontSize: 15,
        color: theme.blackText
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
        color: theme.blackText
    }
  });
  return styles;
}
