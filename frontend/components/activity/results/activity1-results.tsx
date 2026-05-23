import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ResultDetailActivityOne } from "@/services/result/result.type";
import Loading from "../../ui/loading";
import Equation from "../../ui/equation";
import Accordion from "../../ui/accordion";
import Table from "../../ui/table";
import VideoModal from "../../ui/video-modal";
import { createResultStyles } from "./activity-result-style";
import useActivityResult from "./useActivityResults";
import { ActivityResultBaseScreen } from "./activity-result-base";
import CustomDropdown from "@/components/ui/dropdown";

function ActivityOneResultCard(props: {
  item: number;
  videoUri: string | null | undefined;
  mass: number | undefined;
  timePredict: number | undefined;
  timeContact: number | undefined;
  accuracy: number | undefined;
}) {
  const theme = useAppTheme();
  const resultStyles = createResultStyles(theme);

  const dropdownValue = [
    { label: "Case 1: Object does not bounce", value: "no-bounce" },
    { label: "Case 2: Object bounces", value: "bounce" },
  ];

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isBounce, setIsBounce] = useState<"no-bounce" | "bounce" | null>(null);
  const [timeUp, setTimeUp] = useState("");

  const isValidPositiveNumber = (value: string) => {
    if (!value.trim()) return false;
    const num = Number(value);
    return !isNaN(num) && isFinite(num) && num > 0;
  };

  const condition = props.timeContact && props.timeContact > 0;
  const gForceCondition = props.timeContact && props.timeContact > 0;

  const finalVelocity = condition ? 0.6 / props.timeContact! : undefined;
  const acceleration = condition
    ? finalVelocity! / props.timeContact!
    : undefined;

  const netForce =
    acceleration && props.mass ? props.mass * acceleration : undefined;
  const weight = props.mass ? props.mass * 9.8 : undefined;
  const dragForce = weight && netForce ? weight - netForce : undefined;

  const velocityUp = isValidPositiveNumber(timeUp)
    ? 9.8 * Number(timeUp)
    : undefined;
  const [deltaV, setDeltaV] = useState(finalVelocity);

  const gForce = gForceCondition
    ? deltaV! / props.timeContact! / 9.8
    : undefined;

  useEffect(() => {
    if (isBounce === "bounce") {
      if (finalVelocity && velocityUp) {
        setDeltaV(finalVelocity + velocityUp);
      }
    } else {
      setDeltaV(finalVelocity);
    }
  }, [isBounce, finalVelocity, velocityUp]);

  return (
    <View
      key={props.item}
      style={[resultStyles.card, { borderWidth: 1, borderColor: "white" }]}
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
              showTime={true}
            />
          ) : (
            <Text style={resultStyles.descText}>No video</Text>
          )}
        </View>

        <Text style={resultStyles.subtitleText}>
          Mass of toy (gram): {props.mass}{" "}
        </Text>

        <Text style={resultStyles.subtitleText}>
          Time to hit ground (seconds)
        </Text>
        <View style={resultStyles.list}>
          <Text style={resultStyles.listItem}>
            • Predicted: {props.timePredict?.toFixed(3)}
          </Text>
          <Text style={resultStyles.listItem}>
            • Outcome: {props.timeContact?.toFixed(3)}
          </Text>
        </View>

        <Text style={resultStyles.subtitleText}>
          Score (accuracy): {props.accuracy?.toFixed(3)}{" "}
        </Text>

        {/* CALCULATION */}
        <Accordion title="Force Calculations" marginBottom={0}>
          <Text style={resultStyles.calculationText}>
            First, we know that the height is 60 cm or 0.6 m.
          </Text>
          <Text style={resultStyles.calculationText}>
            Then, from the measurements, the time is{" "}
            {props.timeContact?.toFixed(3)} s.
          </Text>
          <Text style={resultStyles.calculationText}>
            Since the toy is dropped, the initial velocity is 0 m/s.
          </Text>

          {condition && (
            <>
              <Text style={[resultStyles.calculationText, { marginBottom: 2 }]}>
                Final velocity calculation:
              </Text>
              <Equation
                latex="v_{final} = \\frac{distance}{time}"
                fontSize={13}
              />
              <Equation
                latex={`v_{final} = \\\\frac{0.6}{${props.timeContact?.toFixed(
                  3,
                )}} \\\\approx ${finalVelocity?.toFixed(3)} \\\\text{ } m/s`}
                fontSize={13}
              />

              <Text
                style={[
                  resultStyles.calculationText,
                  { marginTop: 15, marginBottom: 2 },
                ]}
              >
                Acceleration calculation:
              </Text>
              <Equation
                latex="a = \\frac{v_{final} - v_0}{time}"
                fontSize={13}
              />
              <Equation
                latex={`a = \\\\frac{${finalVelocity?.toFixed(
                  3,
                )} - 0}{${props.timeContact?.toFixed(
                  3,
                )}} \\\\approx ${acceleration?.toFixed(3)} \\\\text{ } m/s^2`}
                fontSize={13}
              />

              <Text
                style={[
                  resultStyles.calculationText,
                  { marginTop: 15, marginBottom: 2 },
                ]}
              >
                Net Force calculation:
              </Text>
              <Equation latex="F_N = mass \\times a" fontSize={13} />
              <Equation
                latex={`F_N = ${props.mass} \\\\times ${acceleration?.toFixed(
                  3,
                )} = ${netForce?.toFixed(3)} \\\\text{ } N`}
                fontSize={13}
              />

              <Text
                style={[
                  resultStyles.calculationText,
                  { marginTop: 15, marginBottom: 2 },
                ]}
              >
                Weight calculation:
              </Text>
              <Equation latex="w = mass \\times g" fontSize={13} />
              <Equation
                latex={`w = ${props.mass} \\\\times 9.8 = ${weight} \\\\text{ } N`}
                fontSize={13}
              />

              <Text
                style={[
                  resultStyles.calculationText,
                  { marginTop: 15, marginBottom: 2 },
                ]}
              >
                Drag Force calculation:
              </Text>
              <Equation latex="F_D = w - F_N" fontSize={13} />
              <Equation
                latex={`F_D = ${weight} - ${netForce?.toFixed(
                  3,
                )} \\\\approx ${dragForce?.toFixed(3)} \\\\text{ } N`}
                fontSize={13}
              />
            </>
          )}
        </Accordion>

        <Accordion title="G-Force Calculations" marginBottom={15}>
          <View style={{ marginBottom: 20 }}>
            <CustomDropdown
              data={dropdownValue}
              value={isBounce ?? ""}
              placeholder="Object bounces?"
              onSelect={(val) => setIsBounce(val as "no-bounce" | "bounce")}
              heightCustom={54}
            />
          </View>

          {gForceCondition && (
            <>
              {isBounce === null ? (
                <Text
                  style={[
                    resultStyles.descText,
                    { textAlign: "center", marginTop: 10 },
                  ]}
                >
                  Please select a bounce case above to see the G-Force
                  calculation.
                </Text>
              ) : isBounce === "no-bounce" ? (
                <>
                  <Text
                    style={[resultStyles.calculationText, { marginBottom: 2 }]}
                  >
                    Object goes from impact speed downward to 0 m/s.
                  </Text>

                  <Equation latex="\\Delta v = v_{impact}" fontSize={13} />

                  <Text
                    style={[
                      resultStyles.calculationText,
                      { marginTop: 5, marginBottom: 2 },
                    ]}
                  >
                    Calculations:
                  </Text>

                  <Equation
                    latex={`\\\\text{g-force} = \\\\frac{v_{final}}{\\\\text{stop time}} \\\\div 9.8`}
                    fontSize={13}
                  />

                  <Equation
                    latex={`\\\\text{g-force} = \\\\frac{${deltaV?.toFixed(
                      3,
                    )}}{${props.timeContact?.toFixed(
                      3,
                    )}} \\\\div 9.8 \\\\approx ${gForce?.toFixed(3)} \\\\text{ } g`}
                    fontSize={13}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={[resultStyles.calculationText, { marginBottom: 2 }]}
                  >
                    Object reverses direction after impact.
                  </Text>

                  <Equation
                    latex="\\Delta v = v_{down} + v_{up}"
                    fontSize={13}
                  />

                  <View style={resultStyles.descContainer}>
                    <Text style={resultStyles.calculationText}>
                      To find the upward velocity, we need the time when the toy
                      reach the max height.
                    </Text>

                    <Text style={resultStyles.calculationText}>
                      However, due to the limitation of our model, it is not
                      possible to output this number.
                    </Text>

                    <Text style={resultStyles.calculationText}>
                      Therefore, we need you to see the time in the slow motion
                      video.
                    </Text>

                    <Text style={resultStyles.calculationText}>
                      Then, input the time the toy reach its maximum height when
                      bouncing here:
                    </Text>
                  </View>

                  <View style={resultStyles.inputContainer}>
                    <TextInput
                      placeholder="Enter time"
                      placeholderTextColor={theme.placeholderText}
                      value={timeUp}
                      onChangeText={setTimeUp}
                      style={resultStyles.input}
                    />
                    <Text style={resultStyles.calculationText}>seconds</Text>
                  </View>

                  {isValidPositiveNumber(timeUp) ? (
                    <>
                      <Text
                        style={[
                          resultStyles.calculationText,
                          { marginTop: 5, marginBottom: 2 },
                        ]}
                      >
                        Finding bounce speed:
                      </Text>

                      <Equation
                        latex="v_{up} = g \\times t_{up}"
                        fontSize={13}
                      />
                      <Equation
                        latex={`v_{up} = 9.8 \\\\times ${Number(timeUp)?.toFixed(3)} = ${velocityUp?.toFixed(3)}`}
                        fontSize={13}
                      />

                      <Equation
                        latex={`\\\\Delta v = v_{down} + v_{up}`}
                        fontSize={13}
                      />
                      <Equation
                        latex={`\\\\Delta v = ${finalVelocity?.toFixed(3)} + ${velocityUp?.toFixed(3)} = ${deltaV?.toFixed(3)}`}
                        fontSize={13}
                      />

                      <Text
                        style={[
                          resultStyles.calculationText,
                          { marginTop: 8, marginBottom: 2 },
                        ]}
                      >
                        Finding g-force:
                      </Text>

                      <Equation
                        latex={`\\\\text{g-force} = \\\\frac{\\\\Delta v}{\\\\text{stop time}} \\\\div 9.8`}
                        fontSize={13}
                      />

                      <Equation
                        latex={`\\\\text{g-force} = \\\\frac{${deltaV?.toFixed(
                          3,
                        )}}{${props.timeContact?.toFixed(
                          3,
                        )}} \\\\div 9.8 \\\\approx ${gForce?.toFixed(3)} \\\\text{ } g`}
                        fontSize={13}
                      />
                    </>
                  ) : (
                    <View style={resultStyles.warningContainer}>
                      <Text style={resultStyles.warning}>
                        Please enter a valid positive number.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </Accordion>
      </View>
    </View>
  );
}

export default function ActivityOneResultsScreen(props: {
  resultId: string;
  onBack: () => void;
}) {
  const theme = useAppTheme();
  const styles = createResultStyles(theme);

  const { id } = useLocalSearchParams();
  const { data, loading, showRating, setShowRating, result } =
    useActivityResult<ResultDetailActivityOne>(props.resultId, 1);

  return loading ? (
    <Loading />
  ) : (
    <ActivityResultBaseScreen
      activityId="1"
      resultId={props.resultId}
      theoryKey="theory1"
      result={result}
      showRating={showRating}
      onCloseRating={() => setShowRating(false)}
      onBack={props.onBack}
      theoryChildren={
        <>
          <Text style={styles.subtitle}>Forces Acting on the Toy</Text>

          <Table
            columns={[
              { key: "force", title: "Force", flex: 0.7 },
              { key: "formula", title: "Formula", flex: 1.3 },
            ]}
            data={[
              {
                force: "Downward (weight)",
                formula: (
                  <Equation latex={"weight = mass \\\\times g"} fontSize={12} />
                ),
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

          <Text
            style={[
              styles.paragraph,
              { fontFamily: "Lato_700Bold", marginBottom: 5 },
            ]}
          >
            Newton Second Law
          </Text>
          <Equation
            latex={"\\\\text{Net Force } (F_N) = mass \\\\times acceleration"}
            fontSize={13}
          />

          {/* -----------GFORCE----------- */}
          <Text style={[styles.subtitle, { marginTop: 40 }]}>G-Force</Text>
          <Text style={styles.paragraph}>
            G-force describes how quickly the object slows down when it hits the
            ground. It is measured in multiples of
          </Text>
          <Equation latex="g = 9.8 m/s^2" fontSize={14} />

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
                effect: "No injury",
              },
              {
                gforce: "5-10 g",
                example: "Hard falls while running, minor car braking",
                effect: "Possible bruising or strains",
              },
              {
                gforce: "10-30 g",
                example:
                  "Sports collisions, bicycle crashes, car crashes with seatbelts",
                effect: "Serious injuries possible (broken bones, concussions)",
              },
              {
                gforce: "30-50 g",
                example: "Severe car crashes, falls onto hard surfaces",
                effect: "High risk of severe injury",
              },
              {
                gforce: "50+ g",
                example: "Very sudden stops with no cushioning",
                effect: "Life-threatening injuries likely",
              },
            ]}
          />

          <Text style={[styles.paragraph, { marginTop: 5, marginBottom: 2 }]}>
            G-force formula:
          </Text>
          <Equation
            latex="\\text{g-force} = \\frac{\\Delta v}{t_{contact}} \\div 9.8"
            fontSize={13}
          />

          <Text style={[styles.paragraph, { marginTop: 5, marginBottom: 2 }]}>
            Case 1 (no bounce):
          </Text>
          <Equation latex="\\Delta v = v_{impact}" fontSize={13} />

          <Text style={[styles.paragraph, { marginTop: 5, marginBottom: 2 }]}>
            Case 2 (bounce):
          </Text>
          <Equation latex="\\Delta v = v_{impact} + v_{up}" fontSize={13} />
        </>
      }
    >
      {data?.outcomes?.map((outcome, index) => (
        <ActivityOneResultCard
          key={index}
          item={index + 1}
          videoUri={data.medias?.[index]?.content}
          mass={data?.predictions[index]?.mass}
          timePredict={data.predictions?.[index]?.prediction}
          timeContact={outcome?.touch_time}
          accuracy={outcome?.score}
        />
      ))}
    </ActivityResultBaseScreen>
  );
}
