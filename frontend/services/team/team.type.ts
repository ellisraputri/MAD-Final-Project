export type TeamDetail = {
    id: string,
    grade: number,
    name: string,
    logo: string,
}

export type TeamDetailResponse = {
    team: TeamDetail | null,
    success: boolean,
    message: string,
}

export type CreateTeamRequest = {
    name: string, 
    grade: number,
}

export type JoinTeamRequest = {
    teamId: string
}

export type TeamBaseResponse = {
    success: boolean,
    message: string,
}