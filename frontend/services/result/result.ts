import { createDefaultError } from "@/constants/error";
import {
  GetResultDetailRequest,
  GetResultDetailResponse,
  GetResultListRequest,
  GetResultListResponse,
  ResultBaseResponse,
  SubmitRatingRequest,
  SubmitResultRequest,
  SubmitResultResponse,
} from "./result.type";
import { apiClient } from "../firebase.js";

export const submitResult = async (
  req: SubmitResultRequest,
): Promise<SubmitResultResponse> => {
  try {
    const response = await apiClient.post("/api/result/submit", req);
    return response.data;
  } catch (error: any) {
    return {
      resultId: "",
      ...createDefaultError(error.response.data.message),
    };
  }
};

export const getResultList = async (
  req: GetResultListRequest,
): Promise<GetResultListResponse> => {
  try {
    const response = await apiClient.get(
      `/api/result/list?teamId=${req.teamId}&activityId=${req.activityId}`,
    );
    return response.data;
  } catch (error: any) {
    return {
      data: [],
      ...createDefaultError(error.response.data.message),
    };
  }
};

export const getResultDetail = async (
  req: GetResultDetailRequest,
): Promise<GetResultDetailResponse> => {
  try {
    const response = await apiClient.get(
      `/api/result/detail?resultId=${req.resultId}`,
    );
    return response.data;
  } catch (error: any) {
    return {
      data: null,
      ...createDefaultError(error.response.data.message),
    };
  }
};

export const submitRating = async (
  req: SubmitRatingRequest,
): Promise<ResultBaseResponse> => {
  try {
    const response = await apiClient.post("/api/result/rating", req);
    return response.data;
  } catch (error: any) {
    return createDefaultError(error.response.data.message);
  }
};
