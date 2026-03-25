import ActivityListCard from "@/components/ui/activity-list-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getActivityList } from "@/services/activity/activity";
import { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";


const imageMap: Record<string, any> = {
  "header.png": require("../../../assets/images/header.png"),
};

export default function ActivityListScreen(){
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [activityList, setActivityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getActivityList();

        if (res?.activities) {
          setActivityList(res.activities);
        }
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Loading...
          </Text>
        ) : (
          activityList.map((row, idx) => (
            <ActivityListCard 
              key={row.id}
              name={row.name}
              type={row.type}
              image={
                row.imageUrl && imageMap[row.imageUrl]
                  ? imageMap[row.imageUrl]
                  : require("../../../assets/images/header.png")
              }
              description={row.description}
              index={idx + 1}
            />
          ))
        )}
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
