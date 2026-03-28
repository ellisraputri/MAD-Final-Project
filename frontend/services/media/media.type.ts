export type MediaRequest = {
    file: RNFile,
    type: string,
    additional?: string,
}

export type Media45Request = {
    text: string,
    type: string,
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

export type MediaDetail = {
    id: string,
    type: string,
    content: string
}