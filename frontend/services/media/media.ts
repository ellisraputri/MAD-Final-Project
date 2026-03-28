import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { CloudinaryUploadResponse, MediaRequest, MediaResponse } from "./media.type";

const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post("/api/upload-cloudinary", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error: any) {
        return {
            url: "",
            ...createDefaultError(error.response.data.message)
        }
    }
  
};

export const uploadMedia = async (req: MediaRequest): Promise<MediaResponse> => { 
    try {
       const res1 = await uploadToCloudinary(req.file)
       if (!res1.success) {
            return {id:"", ...createDefaultError(res1.message)};
        }

        let content = res1.url;
        if(req.additional){
            content += ("####" + req.additional)
        }

        const res2 = await apiClient.post("/api/upload", {
            type: req.type,
            content: content
        });
        return res2.data;


    } catch (error: any) {
        console.log(error);
        return {
            id: "",
            ...createDefaultError(error.response.data.message),
        };
    }
}