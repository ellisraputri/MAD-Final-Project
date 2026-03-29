import { MediaDetail } from "../media/media.type"

export type MyRankDetail = {
    teamId: string,
    score: number,
    attemptNo: number,
    resultId: string,
    rank: number,
}

export type RankDetail = MyRankDetail & {
    teamName: string,
    imageUrl: string,
}

export type MyRankDetailResponse = {
    data: MyRankDetail | null,
    success: boolean,
    message: string,
}

export type RankDetailResponse = {
    data: RankDetail[],
    success: boolean,
    message: string,
}

export type MyRankDetailParams = {
    teamId: string,
    activityType?: string,
}

export type ResultBaseResponse = {
    success: boolean,
    message: string,
}

export type SubmitResultResponse = ResultBaseResponse & {
    resultId: string,
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

export type GetResultDetailRequest = {
    resultId: string,
}

export type ResultDetail = {
    resultId: string,
    activityId: number,
    teamId: string,
    attemptNo: number,
    score: number,
    medias: MediaDetail[],
    outcomes: number[],
    predictions: any[],
    ratings: number,
    comments: string,
}

export type GetResultDetailResponse = {
    success: boolean,
    message: string,
    data: ResultDetail | null
}

export type SubmitRatingRequest = {
    resultId: string,
    ratings?: number,
    comments?: string,
}