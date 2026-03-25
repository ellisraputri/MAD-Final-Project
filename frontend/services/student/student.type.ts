type StudentDetail = {
    appearance: boolean,
    email: string,
    firstName: string,
    grade: number,
    id: string,
    teamId: string,
}

type StudentDetailResponse = {
    user: StudentDetail | null,
    success: boolean,
    message: string,
}

export {StudentDetail, StudentDetailResponse}