import { createDefaultError } from "@/constants/error";
import {apiClient, auth} from "../firebase.js"
import { StudentDetailResponse, UpdateStudentRequest, UpdateStudentResponse } from "./student.type";

export const getStudentDetail = async(): Promise<StudentDetailResponse> => {
    try {
       const response = await apiClient.get("/api/auth/detail");
       return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            data: null,
            ...createDefaultError(error.response.data.message),
        };
    }
}

export const editStudentDetail = async(req: UpdateStudentRequest): Promise<UpdateStudentResponse> => {
    try {
       const response = await apiClient.put("/api/auth/update", req);
       return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            ...createDefaultError(error.response.data.message),
        };
    }
}