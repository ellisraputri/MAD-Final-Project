import { createDefaultError } from "@/constants/error";
import {apiClient} from "../firebase.js"
import { RankDetailResponse } from "./result.type.js";

export const getTopRanking = async(activityType?: string): Promise<RankDetailResponse> => {
    try {
        const params = new URLSearchParams();
        if (activityType) params.append('activityType', activityType);

        const response = await apiClient.get(`/api/result/rank/all?${params.toString()}`);
        return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            data: [],
            ...createDefaultError(error.response.data.message),
        };
    }
}