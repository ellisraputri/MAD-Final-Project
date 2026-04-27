import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import {
  TeamBaseResponse,
  TeamDetailResponse,
  CreateTeamRequest,
  JoinTeamRequest,
  EditTeamRequest,
  TeamBatchDetailResponse,
  TeamBatchDetailRequest,
} from "./team.type";
import { uploadToCloudinary } from "../media/media";

export const getTeamDetail = async (
  teamId: string,
): Promise<TeamDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/team/detail/${teamId}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return {
      team: null,
      ...createDefaultError(error.response.data.message),
    };
  }
};

export const createTeam = async (
  req: CreateTeamRequest,
): Promise<TeamBaseResponse> => {
  try {
    const response = await apiClient.post(`/api/team/create`, req);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return createDefaultError(error.response.data.message);
  }
};

export const joinTeam = async (
  req: JoinTeamRequest,
): Promise<TeamBaseResponse> => {
  try {
    const response = await apiClient.post(`/api/team/join`, req);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return createDefaultError(error.response.data.message);
  }
};

export const editTeam = async (
  req: EditTeamRequest,
): Promise<TeamBaseResponse> => {
  try {
    let logoUrl = req.logoUrl;
    if (req.file) {
      const res1 = await uploadToCloudinary(req.file);
      if (!res1.success) {
        return createDefaultError(res1.message);
      }
      logoUrl = res1.url;
    }

    const response = await apiClient.post("/api/team/edit", {
      teamId: req.teamId,
      name: req.name,
      logoUrl: logoUrl,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    return createDefaultError(error.response.data.message);
  }
};

export const getTeamDetailBatch = async (
  req: TeamBatchDetailRequest,
): Promise<TeamBatchDetailResponse> => {
  try {
    const response = await apiClient.post(`/api/team/detail-batch`, {
      teamIds: req.teamIds,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    return {
      teams: [],
      ...createDefaultError(error.response.data.message),
    };
  }
};
