import theoryActivity from "@/data/activity_theory.json";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { createResultStyles } from "./activity-result-style";
import { useAppContext } from "@/context/AppContext";
import { ScrollView, Text } from "react-native";
import ResultSection from "./activity-result-section";
import RankingCard from "@/components/ui/ranking-card";
import Button from "@/components/ui/button";
import RatingPopup from "@/components/ui/rating-popup";

const defaultLogo =
  "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

export function ActivityResultBaseScreen(props: {
  activityId: string;
  resultId: string | undefined;
  theoryKey: keyof typeof theoryActivity;
  result: ActivityRankDetail | undefined;
  showRating: boolean;
  onCloseRating: () => void;
  onBack: () => void;
  backMarginTop?: number;
  theoryChildren?: React.ReactNode;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = createResultStyles(theme);
  const { team } = useAppContext();

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      >
        <ResultSection title="Theory">
          <Text style={[styles.paragraph, { marginBottom: 30 }]}>
            {theoryActivity[props.theoryKey]}
          </Text>
          {props.theoryChildren}
        </ResultSection>

        <ResultSection title="Results">{props.children}</ResultSection>

        <ResultSection title="Leaderboard Rank">
          {props.result === undefined ? (
            <Text style={styles.paragraph}>
              Still compiling leaderboard data. Please wait until tomorrow.
            </Text>
          ) : (
            <RankingCard
              rank={props.result.rank?.toString() || "-"}
              score={
                props.result ? `${Math.round(props.result.score * 100)}%` : "-"
              }
              teamName={team?.name || "-"}
              imageUrl={team?.logo || defaultLogo}
              attemptNo={props.result.attemptNo.toString()}
            />
          )}
        </ResultSection>

        <Button
          width={250}
          onPress={props.onBack}
          fontSize={20}
          marginTop={props.backMarginTop ?? 5}
          text="Back"
        />
      </ScrollView>

      {props.resultId && (
        <RatingPopup
          activityId={props.activityId}
          resultId={props.resultId}
          showModal={props.showRating}
          onClose={props.onCloseRating}
        />
      )}
    </>
  );
}
