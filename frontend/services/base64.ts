import * as FileSystem from "expo-file-system/legacy";
import { RNFile } from "./media/media.type";

export const base64ToRNFile = async (base64: string): Promise<RNFile> => {
  const fileName = `image_${Date.now()}.png`;
  const fileUri = FileSystem.cacheDirectory + fileName;

  // remove prefix
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    uri: fileUri,
    name: fileName,
    type: "image/png",
  };
};