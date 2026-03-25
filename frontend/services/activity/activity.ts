import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase.js"
import { ActivityListResponse } from "./activity.type.js";

export const getActivityList = async(): Promise<ActivityListResponse> => {
    try {
       const response = await apiClient.get("/api/activity/list");
       return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            activities: [],
            ...createDefaultError(error.response.data.message),
        };
    }
}