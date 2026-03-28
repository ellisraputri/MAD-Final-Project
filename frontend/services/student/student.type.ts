export type StudentDetail = {
    appearance: boolean,
    email: string,
    firstName: string,
    grade: number,
    id: string,
    teamId: string,
}

export type StudentDetailResponse = {
    user: StudentDetail | null,
    success: boolean,
    message: string,
}

export type UpdateStudentRequest = {
    firstName: string,
    appearance: boolean,
}

export type UpdateStudentResponse = {
    success: boolean,
    message: string,
}