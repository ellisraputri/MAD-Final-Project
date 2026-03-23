import { db } from "../config/firestore.js";
import { error400, error500 } from "../config/error.js";
import { mediaModel } from "../models/media.js";


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