import React, { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityThree } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import Equation from "../../ui/equation";
import Table from "../../ui/table";
import Accordion from "../../ui/accordion";
import VideoModal from "../../ui/video-modal";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";

function ActivityThreeResultCard(props: {
  item: number;
  videoUri: string | null;
  bendPredict: number;
  bendCalculated: number;
  accuracy: number;
}) {
  const theme = useAppTheme();
  const resultStyles = createResultStyles(theme);

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
            • Predicted: {props.bendPredict?.toFixed(3)}
          </Text>
          <Text style={resultStyles.listItem}>
            • Outcome: {props.bendCalculated?.toFixed(3)}
          </Text>
        </View>

        <Text style={resultStyles.subtitleText}>
          Score (accuracy): {props.accuracy?.toFixed(3)}{" "}
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
            latex={`\\\\theta = ${props.bendCalculated.toFixed(
              3
            )}^{\\\\circ} \\\\approx ${bendRadian.toFixed(3)} rad`}
            fontSize={13}
          />

          <Text
            style={[resultStyles.descText, { marginTop: 15, marginBottom: 2 }]}
          >
            The applied force:
          </Text>
          <Equation latex={`F \\\\approx k \\\\cdot \\\\theta`} fontSize={13} />
          <Equation
            latex={`F \\\\approx ${0.05} \\\\cdot ${bendRadian.toFixed(
              3
            )} \\\\approx ${force.toFixed(3)} N`}
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
  const styles = createResultStyles(theme);
  const { id } = useLocalSearchParams();

  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivityThree>(props.resultId, 3);

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="3"
      resultId={props.resultId}
      theoryKey="theory3"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
      theoryChildren={
        <>
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
        </>
      }
    >
      {data && (
        <>
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
        </>
      )}
    </ActivityResultBaseScreen>
  );
}
