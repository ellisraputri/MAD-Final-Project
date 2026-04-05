import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import VideoPlayer from '@/components/ui/video-player';
import theoryActivity from '@/data/activity_theory.json';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ResultDetail } from '@/services/result/result.type';
import { getResultDetail } from '@/services/result/result';
import { toast } from 'sonner-native';
import Loading from './ui/loading';
import RatingPopup from './ui/rating-popup';
import { useAppContext } from '@/context/AppContext';
import { ActivityRankDetail } from '@/services/summary/summary.type';
import { getActivityRank } from '@/services/summary/summary';
import RankingCard from './ui/ranking-card';

const defaultLogo = "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";


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
                Bend (degree)
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

export default function ActivityThreeResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();
  const {team} = useAppContext();

  const [data, setData] = useState<ResultDetail>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [result, setResult] = useState<ActivityRankDetail>();

  const fetchDetail = async() => {
    setLoading(true);

    const response = await getResultDetail({resultId: props.resultId});
    if(!response.success || response.data === null){
        toast.error(response.message);
        setLoading(false);
        return;
    }
    setData(response.data);
    if(!response.data?.ratings) setShowRating(true);

    
    const rankingRes = await getActivityRank({activityId: "3"});
    if(!rankingRes.success){
      toast.error(`Failed to fetch leaderboard rank data: ${rankingRes.message}`);
    }
    for(let i=0; i<rankingRes.rankings.length; i++){
      if(rankingRes.rankings[i].resultId === props.resultId){
        setResult(rankingRes.rankings[i]);
        break;
      }
    }

    setLoading(false);
  }

  useEffect(() => {
      fetchDetail();
  }, []);

  return loading? <Loading/> : (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
        {/* Theory */}
        <Section title="Theory">
          <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory3"]}</Text>
        </Section>

        {/* Results */}
        {data &&
          <Section title="Results">
            <ActivityThreeResultCard 
              item={1} videoUri={data.medias[0].content}
              timeCalculated={data.outcomes[0]} timePredict={data.predictions[0].prediction} 
            />
            <ActivityThreeResultCard 
              item={2} videoUri={data.medias[1].content}
              timeCalculated={data.outcomes[1]} timePredict={data.predictions[1].prediction} 
            />
            <ActivityThreeResultCard 
              item={3} videoUri={data.medias[2].content}
              timeCalculated={data.outcomes[2]} timePredict={data.predictions[2].prediction} 
            />
          </Section>
        }

        <Section title="Leaderboard Rank">
            {result===undefined?  
            <Text style={styles.paragraph}>Still compiling leaderboard data. Please wait until tomorrow.</Text>
            :
            <RankingCard 
                rank={result.rank?.toString() || "-"}
                score={result ? `${Math.round(result.score * 100)}%` : "-"}
                teamName={team?.name || "-"}
                imageUrl={team?.logo || defaultLogo}
                attemptNo={result.attemptNo.toString()}
            />
            }
        </Section>

        <Button 
          width={250} onPress={props.onBack}
          fontSize={20} marginTop={5} text='Back'
        />

      </ScrollView>
      {data?.resultId && (
        <RatingPopup
          activityId={'3'}
          resultId={data?.resultId}
          showModal={showRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
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
