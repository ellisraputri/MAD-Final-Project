import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import theoryActivity from '@/data/activity_theory.json';
import Button from './ui/button';
import AudioPlayer from './ui/audio-player';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ResultDetailActivityFive } from '@/services/result/result.type';
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

function ActivityFiveResultCard(props: {
    item: number; 
    vibrateTime: number;
    valuePredict: number;
    valueCalculated: number;
}){
  const theme = useAppTheme();
  const resultStyles = createStyles(theme);

    return(
        <View key={props.item} style={[resultStyles.card, {borderWidth:1, borderColor:"white"}]}>
          <View style={resultStyles.titleRow}>
            <Text style={resultStyles.title}>
                Vibration {props.item}: {props.vibrateTime}s
            </Text>
          </View>

          <View style={resultStyles.list}>
              <Text style={resultStyles.listItem}>
                  • Predicted: {props.valuePredict} cm 
              </Text>
              <Text style={resultStyles.listItem}>
                  • Outcome: {props.valueCalculated} cm
              </Text>
          </View>
        </View>
    )
}

export default function ActivityFiveResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();
  const {team} = useAppContext();

  const [data, setData] = useState<ResultDetailActivityFive>();
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
    if(Number(response.data.activityId) !== 5){
        console.warn("[ActivityFive] Wrong activityId received, skipping render. Got:", response.data.activityId);
        return;  
    }
    setData(response.data as ResultDetailActivityFive);
    if(!response.data?.ratings) setShowRating(true);

    const rankingRes = await getActivityRank({activityId: "5"});
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
          <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory5"]}</Text>
        </Section>

        {/* Results */}
        {data && 
          <Section title="Results">
            {data?.outcomes?.map((outcome, index) => (
              <ActivityFiveResultCard
                key={index}
                item={index + 1}
                vibrateTime={Number(data.medias?.[index]?.content)}
                valueCalculated={outcome.outcome}
                valuePredict={data.predictions?.[index]?.prediction}
              />
            ))}
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
          activityId={'5'}
          resultId={data?.resultId}
          showModal={showRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
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