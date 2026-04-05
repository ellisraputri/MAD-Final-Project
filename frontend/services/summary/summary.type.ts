type Timestamp = {
    _seconds: number,
    _nanoseconds: number,
}

export type GlobalRankDetail = {
    teamId: string,
    score: number,
    totalActivities: number,
    rank: number,
}

export type GlobalRankResponse = {
    rankings: GlobalRankDetail[],
    updatedAt: Timestamp | null,
    success: boolean,
    message: string,
}

export type ActivityRankRequest = {
    activityId: string,
}

export type ActivityRankDetail = {
    resultId: string,
    teamId: string,
    score: number,
    rank: number,
    attemptNo: number,
    timestamp: Timestamp
}

export type ActivityRankResponse = {
    rankings: ActivityRankDetail[],
    updatedAt: Timestamp | null,
    success: boolean,
    message: string,
}
