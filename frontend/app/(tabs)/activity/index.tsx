import ActivityListCard from "@/components/ui/activity-list-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";

const activityList = [
  {
    name: "Parachute Drop Challenge", 
    description:"Students design, build, and test a parachute for a small toy to reduce its landing speed and impact force",
    image: require("../../../assets/images/header.png"),
    type: "Engineering"
  },
  {
    name: "Sound Pollution Hunter", 
    description:"Students measure and compare sound levels in different classroom activities.",
    image: require("../../../assets/images/header.png"),
    type: "Engineering"
  },
  {
    name: "Hand Fan Challenge", 
    description:"Students test how air movement affects flexible materials.",
    image: require("../../../assets/images/header.png"),
    type: "Engineering"
  },
  {
    name: "Earthquake Resistant Structure", 
    description:"Students design structures that withstand vibration, simulating earthquakes.",
    image: require("../../../assets/images/header.png"),
    type: "Engineering"
  },
  {
    name: "Human Performance Lab", 
    description:"Students investigate how the human body moves by measuring speed, smoothness...",
    image: require("../../../assets/images/header.png"),
    type: "Medical"
  },
  {
    name: "Reaction Board Challenge", 
    description:"Students measure reaction time, coordination, and improvement through...",
    image: require("../../../assets/images/header.png"),
    type: "Medical"
  },
  {
    name: "Breathing Pace Trainer", 
    description:"Students analyse breathing patterns at rest and after exercise.",
    image: require("../../../assets/images/header.png"),
    type: "Medical"
  },
]

const imageMap: Record<string, any> = {
  "header.png": require("../../../assets/images/header.png"),
};

export default function ActivityListScreen(){
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return(
    <View style={styles.container}>
      {/* HEADER */}
      <ImageBackground
        source={require("../../../assets/images/header2.jpg")}
        style={styles.header}
        imageStyle={{opacity: 1.0}}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logoApp}
        >
        </Image>

        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Activity</Text>

          <Text style={styles.subtitle}>Explore science firsthand with these interactive lab sessions</Text>
        </View>
      </ImageBackground>

      {/* List */}
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 80 }}
      >
        {activityList.map((row, idx) => (
          <ActivityListCard 
            name={row.name}
            type={row.type}
            image={
              row.image && imageMap[row.image]
                ? imageMap[row.image]
                : require("../../../assets/images/header.png")
            }
            description={row.description}
            index={idx+1}
            key={idx}
          />
        ))}
      </ScrollView>
      
    </View>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      height: 200,
      padding: 20,
    },

    headerContent: {
      marginBottom: 10,
    },

    welcome: {
      fontSize: 36,
      color: "white",
      marginTop: 50,
      fontFamily: "Nunito_700Bold"
    },

    subtitle: {
      color: "white",
      marginTop: 5,
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Lato_400Regular"
    },

    logoApp: {
      position: 'absolute',
      top: 10,
      right: 25,
      width: 40,
      height: 60,
      resizeMode: 'contain',
    },
  });
  return styles;
}
