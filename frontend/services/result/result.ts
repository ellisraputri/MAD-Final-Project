import { createDefaultError } from "@/constants/error";
import { GetResultDetailRequest, GetResultDetailResponse, GetResultListRequest, GetResultListResponse, ResultBaseResponse, SubmitRatingRequest, SubmitResultRequest, SubmitResultResponse } from "./result.type";
import {apiClient} from "../firebase.js"
import { MyRankDetailParams, MyRankDetailResponse, RankDetailResponse } from "./result.type.js";

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

export const getHighestRank = async(inputParams: MyRankDetailParams)
    : Promise<MyRankDetailResponse> => {
    try {
        const params = new URLSearchParams();
        params.append('teamId', inputParams.teamId);
        if (inputParams.activityType) params.append('activityType', inputParams.activityType);

        const response = await apiClient.get(`/api/result/rank/highest-by-team?${params.toString()}`);
        return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            data: null,
            ...createDefaultError(error.response.data.message),
        };
    }
}

export const getLatestRank = async(inputParams: MyRankDetailParams)
    : Promise<MyRankDetailResponse> => {
    try {
        const params = new URLSearchParams();
        params.append('teamId', inputParams.teamId);
        if (inputParams.activityType) params.append('activityType', inputParams.activityType);

        const response = await apiClient.get(`/api/result/rank/latest-by-team?${params.toString()}`);
        return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            data: null,
            ...createDefaultError(error.response.data.message),
        };
    }
}

export const submitResult = async(req: SubmitResultRequest): Promise<SubmitResultResponse> => {
    try {
        const response = await apiClient.post("/api/result/submit", req);
        return response.data;

    } catch (error: any) {
        return {
            resultId: "",
            ...createDefaultError(error.response.data.message)
        }
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

export const getResultDetail = async(req: GetResultDetailRequest): Promise<GetResultDetailResponse> =>{
    try {
        const response = await apiClient.get(`/api/result/detail?resultId=${req.resultId}`);
        return response.data;

    } catch (error: any) {
        return {
            data: null,
            ...createDefaultError(error.response.data.message)
        };
    }
}

export const submitRating = async(req: SubmitRatingRequest): Promise<ResultBaseResponse> => {
    try {
        const response = await apiClient.post("/api/result/rating", req);
        return response.data;

    } catch (error: any) {
        return createDefaultError(error.response.data.message);
    }
}