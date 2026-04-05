import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { ActivityRankRequest, ActivityRankResponse, GlobalRankResponse } from "./summary.type";

export const getGlobalRank = async(): Promise<GlobalRankResponse> => {
    try {
        const response = await apiClient.get(`/api/summary/global`);
        return response.data;

    } catch (error: any) {
        return {
            rankings: [],
            updatedAt: null,
            ...createDefaultError(error.response.data.message)
        };
    }
}

export const getActivityRank = async(req: ActivityRankRequest): Promise<ActivityRankResponse> => {
    try {
        const response = await apiClient.get(`/api/summary/activity/${req.activityId}`);
        return response.data;

    } catch (error: any) {
        return {
            rankings: [],
            updatedAt: null,
            ...createDefaultError(error.response.data.message)
        };
    }
}