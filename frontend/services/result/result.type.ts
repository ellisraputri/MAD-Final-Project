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

export type GetResultListRequest = {
    activityId: string,
    teamId: string,
}

export type ResultList = {
    resultId: string,
    score: number,
    attempt: number,
}

export type GetResultListResponse = {
    data: ResultList[],
    success: boolean,
    message: string,
}