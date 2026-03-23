import {apiClient, auth} from "./firebase.js"

export const getStudentDetail = async() => {
    try {
       const response = await apiClient.get("/api/auth/detail");
       return response.data;

    } catch (error) {
        console.log(error);
    }
}