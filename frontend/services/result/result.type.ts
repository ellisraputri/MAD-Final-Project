export type ResultBaseResponse = {
    success: boolean,
    message: string,
}

export type SubmitResultRequest = {
    activityId: string, 
    teamId: string, 
    medias: string[], 
    predictions: object[]
}