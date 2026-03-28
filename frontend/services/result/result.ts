import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { GetResultListRequest, GetResultListResponse, ResultBaseResponse, SubmitResultRequest } from "./result.type";

export const submitResult = async(req: SubmitResultRequest): Promise<ResultBaseResponse> => {
    try {
        const response = await apiClient.post("/api/result/submit", req);
        return response.data;

    } catch (error: any) {
        return createDefaultError(error.response.data.message);
    }
}

export const getResultList = async(req: GetResultListRequest): Promise<GetResultListResponse> => {
    try {
        const response = await apiClient.get(`/api/result/list?teamId=${req.teamId}&activityId=${req.activityId}`);
        return response.data;

    } catch (error: any) {
        return {
            data: [],
            ...createDefaultError(error.response.data.message)
        };
    }
}