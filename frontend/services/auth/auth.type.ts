type LoginRequest = {
    email: string,
    password: string,
}

type LoginResponse = {
    success: boolean,
    message: string,
}

type RegisterRequest = {
    email: string, 
    password: string,
    firstName: string,
    grade: string,
}

type RegisterResponse = {
    success: boolean,
    message: string,
}

export {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse}