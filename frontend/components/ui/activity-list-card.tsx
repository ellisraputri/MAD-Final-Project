import { useAppTheme } from "@/hooks/use-app-theme";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";

type ActivityProps = {
  name: string;
  description: string;
  image: any;
  type: string;
  index: number;
};

export default function ActivityListCard(props: ActivityProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Link
      href={{
        pathname: "/(tabs)/activity/[id]/instructions",
        params: { id: props.index.toString() },
      }}
      asChild
    >
      <Pressable style={styles.container}>
        {/* Top Image Section */}
        <ImageBackground
          source={props.image}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View
            style={[
              styles.badge,
              props.type === "Engineering"
                ? { backgroundColor: "#BADFE7" }
                : { backgroundColor: "#C2EDCE" },
            ]}
          >
            <Text style={styles.badgeText}>{props.type}</Text>
          </View>
        </ImageBackground>

        {/* Bottom Caption */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Activity {props.index}: {props.name}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {props.description}
          </Text>

          <Text style={[styles.link]}>Find out more...</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export const createStyles = (theme: any) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 25,
      marginHorizontal: 30,
      marginBottom: 40,
      overflow: "hidden",
      backgroundColor: theme.activityCard,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    image: {
      height: 160,
      justifyContent: "flex-start",
    },

    imageStyle: {
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },

    badge: {
      position: "absolute",
      top: 15,
      right: 15,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 8,
    },

    badgeText: {
      color: "#295F6B",
      fontWeight: "600",
    },

    card: {
      backgroundColor: theme.activityCard,
      padding: 20,
    },

    title: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 10,
      color: theme.activityTitle,
      fontFamily: "Lato_700Bold",
    },

    description: {
      fontSize: 15,
      color: theme.activityTitle,
      marginBottom: 15,
      fontFamily: "Lato_400Regular",
      textAlign: "justify",
      lineHeight: 20,
    },

    link: {
      textAlign: "right",
      color: theme.text,
      fontWeight: "500",
      fontSize: 16,
      fontFamily: "Lato_700Bold",
    },
  });
  return styles;
};
