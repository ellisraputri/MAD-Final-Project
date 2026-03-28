import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import theoryActivity from '@/data/activity_theory.json';
import Button from './ui/button';
import AudioPlayer from './ui/audio-player';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ContentAudio } from '@/services/media/media.type';
import { ResultDetail } from '@/services/result/result.type';
import { getResultDetail } from '@/services/result/result';
import { toast } from 'sonner-native';
import { parseMediaContent } from '@/services/media/media';

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

function ActivitySevenResultCard(props: {
    item: number; 
    audioUri: string | null;
    levels: Array<Number>;
    valuePredict: number;
    valueCalculated: number;
}){
  const theme = useAppTheme();
  const resultStyles = createStyles(theme);

    return(
        <View key={props.item} style={[resultStyles.card, {borderWidth:1, borderColor:"white"}]}>
          <View style={resultStyles.titleRow}>
            <Text style={resultStyles.title}>
                {props.item}. Submission {props.item}
            </Text>
          </View>

          <View style={resultStyles.subsContainer}>
            {props.audioUri ? (
                <AudioPlayer uri={props.audioUri} levels={props.levels}/>
            ) : (
                <Text style={resultStyles.descText}>No audio</Text>
            )}
          </View>

          <Text style={resultStyles.subtitleText}>
              Breath per minute
          </Text>
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

export default function ActivitySevenResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();

  const [data, setData] = useState<ResultDetail>();
  const [contents, setContents] = useState<ContentAudio[]>();
  const [loading, setLoading] = useState(false);

  const fetchDetail = async() => {
    setLoading(true);

    const response = await getResultDetail({resultId: props.resultId});
    if(!response.success || response.data === null){
        toast.error(response.message);
        setLoading(false);
        return;
    }

    const contents = response.data.medias.map((m, _) => {
      return parseMediaContent(m.content);
    })

    setContents(contents);
    setData(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Theory */}
      <Section title="Theory">
        <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory7"]}</Text>
      </Section>

      {/* Results */}
      {data && contents &&
        <Section title="Results">
          <ActivitySevenResultCard 
            item={1} audioUri={contents[0].url} levels={contents[0].levels}
            valueCalculated={data.outcomes[0]} valuePredict={data.predictions[0].prediction} 
          />
          <ActivitySevenResultCard 
            item={2} audioUri={contents[1].url} levels={contents[1].levels}
            valueCalculated={data.outcomes[1]} valuePredict={data.predictions[1].prediction} 
          />
          <ActivitySevenResultCard 
            item={3} audioUri={contents[2].url} levels={contents[2].levels}
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
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    grid:{
      flexDirection:"row",
      flexWrap:"wrap",
      justifyContent:"space-between"
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
          fontSize: 20,
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