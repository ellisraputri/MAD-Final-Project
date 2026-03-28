import { db } from "../config/firestore.js";
import { error400, error500 } from "../config/error.js";
import { mediaModel } from "../models/media.js";
import cloudinary from "../config/cloudinary.js";

export const uploadMedia = async (req, res) => {
  try {
    const { type, content } = req.body;
    if (!type || !content) {
      return error400(res, "Request body is not complete.");
    }

    const mediaRef = db.collection('medias').doc(); 
    const mediaData = mediaModel({
      id: mediaRef.id,
      type: type,
      content: content
    });

    await mediaRef.set(mediaData);

    return res.status(200).json({
      id: mediaRef.id,
      success: true,
      message: "Media uploaded successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const uploadToCloudinary = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return error400(res, "No file uploaded");
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "users", resource_type: "auto" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(file.buffer); // ✅ from multer
    });

    return res.json({
      url: uploadResult.secure_url,
      success: true,
      message: "Upload to cloud success"
    });
  } catch (error) {
    console.error(error);
    return error500(res);
  }
};