import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { TeamBaseResponse, TeamDetailResponse, CreateTeamRequest, JoinTeamRequest } from "./team.type";

export const getTeamDetail = async(teamId: string): Promise<TeamDetailResponse> => {
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
}

export const createTeam = async(req: CreateTeamRequest): Promise<TeamBaseResponse> => {
    try {
       const response = await apiClient.post(`/api/team/create`, req);
       return response.data;

    } catch (error: any) {
        console.log(error);
        return createDefaultError(error.response.data.message);
    }
}

export const joinTeam = async(req: JoinTeamRequest): Promise<TeamBaseResponse> => {
    try {
       const response = await apiClient.post(`/api/team/join`, req);
       return response.data;

    } catch (error: any) {
        console.log(error);
        return createDefaultError(error.response.data.message);
    }
}