import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theoryActivity from "@/data/activity_theory.json";
import Button from "./ui/button";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityThree } from "@/services/result/result.type";
import { getResultDetail } from "@/services/result/result";
import { toast } from "sonner-native";
import Loading from "./ui/loading";
import RatingPopup from "./ui/rating-popup";
import { useAppContext } from "@/context/AppContext";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { getActivityRank } from "@/services/summary/summary";
import RankingCard from "./ui/ranking-card";
import Equation from "./ui/equation";
import Table from "./ui/table";
import Accordion from "./ui/accordion";
import VideoModal from "./ui/video-modal";

const defaultLogo =
  "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={{ marginBottom: 50 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

function ActivityThreeResultCard(props: {
  item: number;
  videoUri: string | null;
  bendPredict: number;
  bendCalculated: number;
  accuracy: number;
}) {
  const theme = useAppTheme();
  const resultStyles = createStyles(theme);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const bendRadian = degToRad(props.bendCalculated);

  const force = 0.05 * bendRadian;

  return (
    <View
      key={props.item}
      style={[resultStyles.card, { borderColor: "white", borderWidth: 1 }]}
    >
      <View style={resultStyles.titleRow}>
        <Text style={resultStyles.title}>
          {props.item}. Submission {props.item}
        </Text>
      </View>

      <View style={resultStyles.subsContainer}>
        <View style={resultStyles.videoPlaceholder}>
          {props.videoUri ? (
            <VideoModal
              showModal={showVideoModal}
              videoUri={props.videoUri}
              openModal={() => setShowVideoModal(true)}
              closeModal={() => setShowVideoModal(false)}
            />
          ) : (
            <Text style={resultStyles.descText}>No video</Text>
          )}
        </View>

        <Text style={resultStyles.subtitleText}>Bend (degrees)</Text>
        <View style={resultStyles.list}>
          <Text style={resultStyles.listItem}>
            • Predicted: {props.bendPredict}
          </Text>
          <Text style={resultStyles.listItem}>
            • Outcome: {props.bendCalculated}
          </Text>
        </View>

        <Text style={resultStyles.subtitleText}>
          Score (accuracy): {props.accuracy?.toFixed(2)}{" "}
        </Text>

        {/* CALCULATION */}
        <Accordion title="Calculation" marginBottom={0}>
          <Text style={resultStyles.descText}>
            The object is thin paper. So,{" "}
          </Text>
          <Equation latex="k = 0.05 \\text{ } N/rad" fontSize={13} />

          <Text
            style={[resultStyles.descText, { marginTop: 15, marginBottom: 2 }]}
          >
            The observed bend angle:
          </Text>
          <Equation
            latex={`\\\\theta = ${props.bendCalculated.toFixed(3)}^{\\\\circ} \\\\approx ${bendRadian.toFixed(3)} rad`}
            fontSize={13}
          />

          <Text
            style={[resultStyles.descText, { marginTop: 15, marginBottom: 2 }]}
          >
            The applied force:
          </Text>
          <Equation latex={`F \\\\approx k \\\\cdot \\\\theta`} fontSize={13} />
          <Equation
            latex={`F \\\\approx ${0.05} \\\\cdot ${bendRadian.toFixed(3)} \\\\approx ${force.toFixed(3)} N`}
            fontSize={13}
          />
        </Accordion>
      </View>
    </View>
  );
}

export default function ActivityThreeResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams();
  const { team } = useAppContext();

  const [data, setData] = useState<ResultDetailActivityThree>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [result, setResult] = useState<ActivityRankDetail>();

  const fetchDetail = async () => {
    setLoading(true);

    const response = await getResultDetail({ resultId: props.resultId });
    if (!response.success || response.data === null) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    if (Number(response.data.activityId) !== 3) {
      console.warn(
        "[ActivityThree] Wrong activityId received, skipping render. Got:",
        response.data.activityId,
      );
      return;
    }
    setData(response.data as ResultDetailActivityThree);
    if (!response.data?.ratings) setShowRating(true);

    const rankingRes = await getActivityRank({ activityId: "3" });
    if (!rankingRes.success) {
      toast.error(
        `Failed to fetch leaderboard rank data: ${rankingRes.message}`,
      );
    }
    for (let i = 0; i < rankingRes.rankings.length; i++) {
      if (rankingRes.rankings[i].resultId === props.resultId) {
        setResult(rankingRes.rankings[i]);
        break;
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      >
        {/* Theory */}
        <Section title="Theory">
          <Text style={[styles.paragraph, { marginBottom: 30 }]}>
            {theoryActivity["theory3"]}
          </Text>
          <Text style={styles.paragraph}>
            Moving air applies force to objects. Paper bends due to flexibility
            (plasticity), and repeated bending can weaken it.
          </Text>

          <Text style={styles.subtitle}>Forces to Bend Paper</Text>
          <Text style={[styles.paragraph, { marginBottom: 2 }]}>
            For bending a sheet of paper:
          </Text>
          <Equation latex={"F \\\\approx k \\\\cdot \\\\theta"} fontSize={13} />

          <Text style={[styles.paragraph, { marginBottom: 2 }]}>where:</Text>
          <Equation latex={"F = \\\\text{force applied } (N)"} fontSize={13} />
          <Equation
            latex={"\\\\theta = \\\\text{bend angle } (radians)"}
            fontSize={13}
          />
          <Equation
            latex={"k = \\\\text{stiffness coefficient }"}
            fontSize={13}
          />

          <Text style={[styles.paragraph, { marginTop: 10, marginBottom: 2 }]}>
            In reality, k is related to flexural rigidity
          </Text>
          <Equation latex={"D = \\\\frac{Et^3}{12(1-v^2)}"} fontSize={13} />
          <Text style={[styles.paragraph, { marginTop: 0 }]}>
            but for classroom experiments we can use approximate empirical
            values. The force required increases strongly with stiffness.
          </Text>

          <Text style={styles.subtitle}>
            Approximate k Values for Different Paper
          </Text>
          <Table
            columns={[
              { key: "material", title: "Material", flex: 1.2 },
              { key: "thickness", title: "Thickness (mm)", flex: 0.8 },
              { key: "stiffness", title: "Stiffness k (N/rad)", flex: 0.8 },
              { key: "notes", title: "Notes", flex: 1.2 },
            ]}
            data={[
              {
                material: "Thin printer paper",
                thickness: "0.1",
                stiffness: "0.05",
                notes: "Bends very easily",
              },
              {
                material: "Standard card stock",
                thickness: "0.25",
                stiffness: "0.2",
                notes: "Moderate bend",
              },
              {
                material: "Thin cardboard",
                thickness: "0.5",
                stiffness: "0.5",
                notes: "Much harder to bend",
              },
              {
                material: "Corrugated cardboard",
                thickness: "3",
                stiffness: "2-3",
                notes: "Very stiff, almost no bend",
              },
            ]}
          />
          <Text style={styles.paragraph}>
            These are rough classroom values to let students estimate forces.
            The point is to see relative differences between materials.
          </Text>
        </Section>

        {/* Results */}
        {data && (
          <Section title="Results">
            {data?.outcomes?.map((outcome, index) => (
              <ActivityThreeResultCard
                key={index}
                item={index + 1}
                videoUri={data.medias?.[index]?.content}
                bendCalculated={outcome.max_bend}
                bendPredict={data.predictions?.[index]?.prediction}
                accuracy={outcome.score}
              />
            ))}
          </Section>
        )}

        <Section title="Leaderboard Rank">
          {result === undefined ? (
            <Text style={styles.paragraph}>
              Still compiling leaderboard data. Please wait until tomorrow.
            </Text>
          ) : (
            <RankingCard
              rank={result.rank?.toString() || "-"}
              score={result ? `${Math.round(result.score * 100)}%` : "-"}
              teamName={team?.name || "-"}
              imageUrl={team?.logo || defaultLogo}
              attemptNo={result.attemptNo.toString()}
            />
          )}
        </Section>

        <Button
          width={250}
          onPress={props.onBack}
          fontSize={20}
          marginTop={5}
          text="Back"
        />
      </ScrollView>
      {data?.resultId && (
        <RatingPopup
          activityId={"3"}
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
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 5,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      fontFamily: "Lato_700Bold",
    },

    divider: {
      height: 2,
      backgroundColor: theme.text,
      marginVertical: 10,
    },

    paragraph: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "justify",
      fontFamily: "Lato_400Regular",
      color: theme.blackText,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    subtitle: {
      marginTop: 40,
      fontSize: 17,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      marginBottom: 10,
    },
    subsContainer: {
      marginLeft: 20,
    },
    titleRow: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    card: {
      width: "100%",
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
    videoPlaceholder: {
      height: 400,
      width: "100%",
      borderWidth: 2,
      borderColor: theme.text,
      backgroundColor: theme.hoverBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      overflow: "hidden",
    },
    prediction: {
      marginTop: 15,
      fontFamily: "Lato_700Bold",
      color: theme.text,
      fontSize: 18,
    },
    subtitleText: {
      marginTop: 10,
      fontFamily: "Lato_700Bold",
      fontSize: 16,
      color: theme.blackText,
    },
    descText: {
      marginTop: 10,
      fontFamily: "Lato_400Regular",
      fontSize: 15,
      color: theme.blackText,
    },
    closeBtnText: {
      color: "#fff",
      fontFamily: "Lato_400Regular",
      fontSize: 14,
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
    },
  });
  return styles;
};
