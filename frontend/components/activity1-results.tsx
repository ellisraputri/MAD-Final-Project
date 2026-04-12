import React, { useEffect, useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router';
import VideoPlayer from '@/components/ui/video-player';
import theoryActivity from '@/data/activity_theory.json';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ResultDetailActivityOne } from '@/services/result/result.type';
import { getResultDetail } from '@/services/result/result';
import { toast } from 'sonner-native';
import Loading from './ui/loading';
import RatingPopup from './ui/rating-popup';
import { ActivityRankDetail } from '@/services/summary/summary.type';
import { getActivityRank } from '@/services/summary/summary';
import { useAppContext } from '@/context/AppContext';
import RankingCard from './ui/ranking-card';
import Equation from './ui/equation';
import Accordion from './ui/accordion';
import Table from './ui/table';

const defaultLogo = "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";


function Section({title, children}: {title: string, children: React.ReactNode}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={{marginBottom: 50}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider}/>
      {children}
    </View>
  );
}

function ActivityOneResultCard(props: {
    item: number; 
    videoUri: string | null | undefined;
    mass: number | undefined;
    timePredict: number | undefined;
    timeCalculated: number | undefined;
    timeStop: number | undefined;
    accuracy: number | undefined;
}){
    const theme = useAppTheme();
    const resultStyles = createStyles(theme);

    const [showVideoModal, setShowVideoModal] = useState(false);
    const condition = props.timeCalculated && props.timeCalculated > 0;
    const gForceCondition = props.timeStop && props.timeStop > 0;

    const finalVelocity = condition? 0.3 / props.timeCalculated! : undefined;
    const acceleration = condition? finalVelocity! / props.timeCalculated! : undefined;

    const netForce = acceleration && props.mass? props.mass * acceleration: undefined;
    const weight = props.mass? props.mass * 9.8: undefined;
    const dragForce = weight && netForce? weight - netForce: undefined;

    const gForce = gForceCondition? (finalVelocity! / props.timeStop!) / 9.8: undefined;

    return(
        <View key={props.item} style={[resultStyles.card, {borderWidth:1, borderColor:"white"}]}>
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
                        <Ionicons name="play-circle" size={60} color={theme.text} />
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

            <Text style={resultStyles.subtitleText}>Time to stop (seconds): {props.timeStop?.toFixed(2)} </Text>
            <Text style={resultStyles.subtitleText}>Score (accuracy): {props.accuracy?.toFixed(2)} </Text>

            {/* CALCULATION */}
            <Accordion title="Force Calculations" marginBottom={0}>
                <Text style={resultStyles.calculationText}>First, we know that the height is 30 cm or 0.3 m.</Text>
                <Text style={resultStyles.calculationText}>Then, from the measurements, the time is {props.timeCalculated} s.</Text>
                <Text style={resultStyles.calculationText}>Since the toy is dropped, the initial velocity is 0 m/s.</Text>

                {condition &&
                    (
                    <>
                        <Text style={[resultStyles.calculationText, {marginBottom: 2}]}>Final velocity calculation:</Text>
                        <Equation latex='v_{final} = \\frac{distance}{time}' fontSize={13}/>
                        <Equation latex={`v_{final} = \\\\frac{0.3}{${props.timeCalculated?.toFixed(3)}} \\\\approx ${finalVelocity?.toFixed(3)} \\\\text{ } m/s`} fontSize={13}/>

                        <Text style={[resultStyles.calculationText, {marginTop: 15, marginBottom: 2}]}>Acceleration calculation:</Text>
                        <Equation latex='a = \\frac{v_{final} - v_0}{time}' fontSize={13}/>
                        <Equation latex={`a = \\\\frac{${finalVelocity?.toFixed(3)} - 0}{${props.timeCalculated?.toFixed(3)}} \\\\approx ${acceleration?.toFixed(3)} \\\\text{ } m/s^2`} fontSize={13}/>

                        <Text style={[resultStyles.calculationText, {marginTop: 15, marginBottom: 2}]}>Net Force calculation:</Text>
                        <Equation latex='F_N = mass \\times a' fontSize={13}/>
                        <Equation latex={`F_N = ${props.mass} \\\\times ${acceleration?.toFixed(3)} = ${netForce?.toFixed(3)} \\\\text{ } N`} fontSize={13}/>

                        <Text style={[resultStyles.calculationText, {marginTop: 15, marginBottom: 2}]}>Weight calculation:</Text>
                        <Equation latex='w = mass \\times g' fontSize={13}/>
                        <Equation latex={`w = ${props.mass} \\\\times 9.8 = ${weight} \\\\text{ } N`} fontSize={13}/>

                        <Text style={[resultStyles.calculationText, {marginTop: 15, marginBottom: 2}]}>Drag Force calculation:</Text>
                        <Equation latex='F_D = w - F_N' fontSize={13}/>
                        <Equation latex={`F_D = ${weight} - ${netForce?.toFixed(3)} \\\\approx ${dragForce?.toFixed(3)} \\\\text{ } N`} fontSize={13}/>
                    </>
                    )
                }
            </Accordion>

            <Accordion title="G-Force Calculations" marginBottom={15}>
                {gForceCondition &&
                    (
                    <>
                        <Text style={[resultStyles.calculationText, {fontFamily: 'Lato_700Bold'}]}>Case 1: Object does not bounce</Text>

                        <Text style={[resultStyles.calculationText, {marginBottom: 2}]}>Object goes from impact speed downward to 0 m/s.</Text>
                        <Equation latex='\\Delta v = v_{impact}' fontSize={13}/>

                        <Text style={[resultStyles.calculationText, {marginTop: 5, marginBottom: 2}]}>Calculations:</Text>
                        <Equation latex={`\\\\text{g-force} = \\\\frac{v_{final}}{\\\\text{stop time}} \\\\div 9.8`} fontSize={13}/>
                        <Equation latex={`\\\\text{g-force} = \\\\frac{${finalVelocity?.toFixed(3)}}{${props.timeStop?.toFixed(3)}} \\\\div 9.8 \\\\approx ${gForce?.toFixed(3)} \\\\text{ } g`} fontSize={13}/>
                    </>
                    )
                }
            </Accordion>
            
        </View>
        </View>
    )
}

export default function ActivityOneResultsScreen(props: {resultId: string, onBack: ()=>void}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const {team} = useAppContext();

  const { id } = useLocalSearchParams();
  const [data, setData] = useState<ResultDetailActivityOne>();
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

    if(Number(response.data.activityId) !== 1){
        console.warn("[ActivityOne] Wrong activityId received, skipping render. Got:", response.data.activityId);
        return;  
    }
    setData(response.data as ResultDetailActivityOne);
    if(!response.data?.ratings) setShowRating(true);
    
    const rankingRes = await getActivityRank({activityId: "1"});
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


  return loading? (
    <Loading/>
  ) : (
    <>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
        {/* Theory */}
        <Section title="Theory">
            <Text style={[styles.paragraph, {marginBottom: 30}]}>{theoryActivity["theory1"]}</Text>
            
            <Text style={styles.subtitle}>
                Forces Acting on the Toy
            </Text>

            <Table
                columns={[
                    { key: "force", title: "Force", flex: 0.7 },
                    { key: "formula", title: "Formula", flex: 1.3 },
                ]}
                data={[
                    {
                    force: "Downward (weight)",
                    formula: <Equation latex={"weight = mass \\\\times g"} fontSize={12} />,
                    },
                    {
                    force: "Upward (drag)",
                    formula: "Drag force from the parachute",
                    },
                    {
                    force: "Net (total) force",
                    formula: "Net Force = Weight - Drag Force",
                    },
                ]}
            />

            <Text style={[styles.paragraph, {fontFamily: 'Lato_700Bold', marginBottom: 5}]}>Newton's Second Law</Text>
            <Equation latex={"\\\\text{Net Force } (F_N) = mass \\\\times acceleration"} fontSize={13} />

            {/* -----------GFORCE----------- */}
            <Text style={[styles.subtitle, {marginTop: 40}]}>G-Force</Text>
            <Text style={styles.paragraph}>G-force describes how quickly the object slows down when it hits the ground. It is measured in multiples of</Text>
                <Equation latex='g = 9.8 m/s^2' fontSize={14}/>

                <Table
                    columns={[
                        { key: "gforce", title: "G Force Range", flex: 0.7 },
                        { key: "example", title: "Examples", flex: 1.4 },
                        { key: "effect", title: "Likely Effects", flex: 0.9 },
                    ]}
                    data={[
                        {
                            gforce: "1-5 g",
                            example: "Standing up quickly, elevators, amusement rides",
                            effect: "No injury"
                        },
                        {
                            gforce: "5-10 g",
                            example: "Hard falls while running, minor car braking",
                            effect: "Possible bruising or strains"
                        },
                        {
                            gforce: "10-30 g",
                            example: "Sports collisions, bicycle crashes, car crashes with seatbelts",
                            effect: "Serious injuries possible (broken bones, concussions)"
                        },
                        {
                            gforce: "30-50 g",
                            example: "Severe car crashes, falls onto hard surfaces",
                            effect: "High risk of severe injury"
                        },
                        {
                            gforce: "50+ g",
                            example: "Very sudden stops with no cushioning",
                            effect: "Life-threatening injuries likely"
                        },
                    ]}
                />

                <Text style={[styles.paragraph, {marginTop: 5, marginBottom: 2}]}>G-force formula:</Text>
                <Equation latex='\\text{g-force} = \\frac{\\Delta v}{t_{contact}} \\div 9.8' fontSize={13}/>

                <Text style={[styles.paragraph, {marginTop: 5, marginBottom: 2}]}>Case 1 (no bounce):</Text>
                <Equation latex='\\Delta v = v_{impact}' fontSize={13}/>

                <Text style={[styles.paragraph, {marginTop: 5, marginBottom: 2}]}>Case 2 (bounce):</Text>
                <Equation latex='\\Delta v = v_{impact} + v_{up}' fontSize={13}/>
        </Section>

        {/* Results */}
        <Section title="Results">
            {data?.outcomes?.map((outcome, index) => (
              <ActivityOneResultCard
                key={index}
                item={index + 1}
                videoUri={data.medias?.[index]?.content}
                mass={data?.predictions[index]?.mass}
                timeCalculated={outcome?.touch_time}
                timePredict={data.predictions?.[index]?.prediction}
                timeStop={outcome?.stop_time}
                accuracy={outcome?.score}
              />
            ))}
        </Section>

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
                activityId={'1'}
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

    subtitle: {
        marginTop: 20,
        fontSize: 17,
        fontFamily: "Lato_700Bold",
        color: theme.text,
        marginBottom: 10,
    },

    table: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: theme.text,
        marginBottom: 20,
    },

    tableRowHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theme.text,
        backgroundColor: theme.hoverBackground,
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theme.text,
        alignItems: 'stretch',
    },

    colLeft: {
        flex: 0.7,
        padding: 12,
        borderRightWidth: 1,
        borderColor: theme.text,
        justifyContent: "center",
    },

    colRight: {
        flex: 1.3,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    tableHeader: {
        fontFamily: "Lato_700Bold",
        color: theme.text,
        textAlign: 'center'
    },

    tableCellText: {
        fontFamily: "Lato_400Regular",
        color: theme.blackText,
        textAlign: 'center'
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
    },
    calculationText: {
        fontSize: 15,
        fontFamily: "Lato_400Regular",
        marginBottom: 15,
        color: theme.blackText
    }
  });
  return styles;
}
