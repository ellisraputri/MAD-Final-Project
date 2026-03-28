import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { ResultBaseResponse, SubmitResultRequest } from "./result.type";

export const submitResult = async(req: SubmitResultRequest): Promise<ResultBaseResponse> => {
    try {
        const response = await apiClient.post("/api/result/submit", req);
        return response.data;

    } catch (error: any) {
        return createDefaultError(error.response.data.message);
    }
}