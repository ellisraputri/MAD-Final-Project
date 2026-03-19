import ActivityOneResultsScreen from "@/components/activity1-results";
import ResultCard from "@/components/ui/result-card";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ExplanationScreen(){
	const {id} = useGlobalSearchParams();
	const [detailsVisible, setDetailsVisible] = useState(false);
	const results = [
    {score: 100}, 
    {score: 20},
    {score: 30}
	]

	return(
		<ScrollView style={styles.container}>
				{!detailsVisible &&
				 	<View>
						<Text style={styles.titleText}>Attempts</Text>
						<View style={{ height: 1, backgroundColor: '#388087', marginVertical: 10 }} />

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
				
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:"#fff",
		paddingHorizontal: 30,
	},
	titleText:{
		marginTop: 30,
		textAlign: "center",
		fontFamily: "Lato_700Bold",
		fontSize: 20,
		color: "#388087"
	}
})