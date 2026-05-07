import { useAppContext } from "@/context/AppContext";
import { getResultDetail } from "@/services/result/result";
import { getActivityRank } from "@/services/summary/summary";
import { ActivityRankDetail } from "@/services/summary/summary.type";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

export default function useActivityResult<T>(
  resultId: string,
  activityId: number,
  extraSetup?: (data: T) => Promise<void>,
  requiresTeam?: boolean
) {
  const { team } = useAppContext();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [result, setResult] = useState<ActivityRankDetail>();

  const fetchDetail = async () => {
    if (requiresTeam && !team) return;
    setLoading(true);

    const response = await getResultDetail({ resultId });
    if (!response.success || !response.data) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    if (Number(response.data.activityId) !== activityId) {
      console.warn(
        `[Activity${activityId}] Wrong activityId, Got: `,
        response.data.activityId
      );
      setLoading(false);
      return;
    }

    await extraSetup?.(response.data as T);

    setData(response.data as T);
    if (!response.data.ratings) setShowRating(true);

    const rankingRes = await getActivityRank({
      activityId: String(activityId),
    });

    if (!rankingRes.success) {
      toast.error(
        `Failed to fetch leaderboard rank data: ${rankingRes.message}`
      );
    }

    const match = rankingRes.rankings.find((r) => r.resultId === resultId);
    if (match) setResult(match);

    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, []);
  return { data, loading, showRating, setShowRating, result };
}
