type RankDetail = {
    teamId: string,
    score: number,
    attemptNo: number,
    resultId: string,
    rank: number,
    teamName: string,
    imageUrl: string,
}

type RankDetailResponse = {
    data: RankDetail[],
    success: boolean,
    message: string,
}

export {RankDetail, RankDetailResponse}