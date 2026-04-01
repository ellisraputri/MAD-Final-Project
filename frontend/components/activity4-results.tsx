import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import theoryActivity from '@/data/activity_theory.json';
import Button from './ui/button';
import AudioPlayer from './ui/audio-player';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ResultDetail } from '@/services/result/result.type';
import { getResultDetail } from '@/services/result/result';
import { toast } from 'sonner-native';
import Loading from './ui/loading';
import RatingPopup from './ui/rating-popup';

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

export default function ActivityFourResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<ResultDetail>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

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
          <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory4"]}</Text>
        </Section>

        {/* Results */}
        {data && 
          <Section title="Results">
            <ActivityFourResultCard 
              item={1} vibrateTime={Number(data.medias[0].content)}
              valueCalculated={data.outcomes[0]} valuePredict={data.predictions[0].prediction} 
            />
            <ActivityFourResultCard 
              item={2} vibrateTime={Number(data.medias[1].content)}
              valueCalculated={data.outcomes[1]} valuePredict={data.predictions[1].prediction} 
            />
            <ActivityFourResultCard 
              item={3} vibrateTime={Number(data.medias[2].content)}
              valueCalculated={data.outcomes[2]} valuePredict={data.predictions[2].prediction} 
            />
          </Section>
        }

        <Button 
          width={250} onPress={()=>alert("see leaderboard")}
          fontSize={20} marginTop={5} text='See Leaderboard'
        />
        <Button 
          width={250} onPress={props.onBack}
          fontSize={20} marginTop={5} text='Back'
        />

      </ScrollView>

      {data?.resultId && (
        <RatingPopup
          activityId={'4'}
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
