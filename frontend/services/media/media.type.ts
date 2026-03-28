export type MediaRequest = {
    file: File,
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