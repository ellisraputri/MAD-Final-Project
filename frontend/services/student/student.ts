import { createDefaultError } from "@/constants/error";
import {apiClient, auth} from "../firebase.js"
import { StudentDetailResponse } from "./student.type";

export const getStudentDetail = async(): Promise<StudentDetailResponse> => {
    try {
       const response = await apiClient.get("/api/auth/detail");
       return response.data;

    } catch (error: any) {
        console.log(error);
        return {
            user: null,
            ...createDefaultError(error.response.data.message),
        };
    }
}