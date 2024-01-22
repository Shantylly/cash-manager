export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RegisterResponse {
    access_token: string;
}
