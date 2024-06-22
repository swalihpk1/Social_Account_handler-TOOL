export interface UserData {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface UserInfo {
    name: string;
    email: string;
}

export interface AuthState {
    userInfo: UserInfo | null;
}