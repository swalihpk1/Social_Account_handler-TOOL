export interface UserData {
    name?: string;
    email: string
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface UserInfo {
    name?: string;
    email: string;
}

export interface AuthState {
    userInfo: UserInfo | null;
}

export interface LoginFormData {
    email: string;
    password: string;
}
