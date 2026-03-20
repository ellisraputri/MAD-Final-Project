import ActivityOneResultsScreen from "@/components/activity1-results";
import ActivityTwoResultsScreen from "@/components/activity2-results";
import ActivityThreeResultsScreen from "@/components/activity3-results";
import ActivityFourResultsScreen from "@/components/activity4-results";
import ActivityFiveResultsScreen from "@/components/activity5-results";
import ActivitySixResultsScreen from "@/components/activity6-results";
import ActivitySevenResultsScreen from "@/components/activity7-results";
import ResultCard from "@/components/ui/result-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ExplanationScreen(){
	const theme = useAppTheme();
	const styles = createStyles(theme);

	const {id} = useGlobalSearchParams();
	const [detailsVisible, setDetailsVisible] = useState(false);
	const results = [
    {score: 100}, 
    {score: 20},
    {score: 30}
	]

	useFocusEffect(
		useCallback(() => {
		  setDetailsVisible(false);
		}, [])
	  );

	return(
		<ScrollView style={styles.container}>
				{!detailsVisible &&
				 	<View>
						<Text style={styles.titleText}>Attempts</Text>
						<View style={{ height: 1, backgroundColor: theme.blackText, marginVertical: 10 }} />

						<View style={{marginTop: 10}}>
							{results.length === 0 && <Text>No attempt yet</Text>}
							{results.length > 0 && results.map((item, index) => (
								<ResultCard key={index} index={index+1} score={item.score} onPress={() => setDetailsVisible(true)}/>
							))}
						</View>
					</View>
				}

				{
					detailsVisible && Number(id)===1 && <ActivityOneResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===2 && <ActivityTwoResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===3 && <ActivityThreeResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===4 && <ActivityFourResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===5 && <ActivityFiveResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===6 && <ActivitySixResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}

				{
					detailsVisible && Number(id)===7 && <ActivitySevenResultsScreen onBack={()=>setDetailsVisible(false)}/>
				}
				
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
		titleText:{
			marginTop: 30,
			textAlign: "center",
			fontFamily: "Lato_700Bold",
			fontSize: 20,
			color: theme.blackText
		}
	})
	return styles;
}