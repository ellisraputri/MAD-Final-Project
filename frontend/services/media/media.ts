import { createDefaultError } from "@/constants/error";
import { apiClient } from "../firebase";
import { CloudinaryUploadResponse, Media45Request, MediaRequest, MediaResponse, RNFile } from "./media.type";

export const uploadToCloudinary = async (file: RNFile): Promise<CloudinaryUploadResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file as any);

        const response = await apiClient.post("/api/media/upload-cloudinary", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error: any) {
        console.log(error);
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

        const res2 = await apiClient.post("/api/media/upload", {
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

export const uploadMedia45 = async (req: Media45Request): Promise<MediaResponse> => { 
    try {
        const res2 = await apiClient.post("/api/media/upload", {
            type: req.type,
            content: req.text
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