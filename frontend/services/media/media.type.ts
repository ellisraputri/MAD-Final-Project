export type MediaRequest = {
    file: RNFile,
    type: string,
    additional?: string,
}

export type MediaResponse = {
    id: string,
    success: boolean,
    message: string,
}

export type CloudinaryUploadResponse = {
    url: string,
    success: boolean,
    message: string
}

export type RNFile = {
  uri: string;
  name: string;
  type: string;
};