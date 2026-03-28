type MyRankDetail = {
    teamId: string,
    score: number,
    attemptNo: number,
    resultId: string,
    rank: number,
}

type RankDetail = MyRankDetail & {
    teamName: string,
    imageUrl: string,
}

type MyRankDetailResponse = {
    data: MyRankDetail | null,
    success: boolean,
    message: string,
}

type RankDetailResponse = {
    data: RankDetail[],
    success: boolean,
    message: string,
}

type MyRankDetailParams = {
    teamId: string,
    activityType?: string,
}


export {MyRankDetail, RankDetail, MyRankDetailResponse, RankDetailResponse, MyRankDetailParams}