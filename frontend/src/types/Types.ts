export interface UserData {
    name?: string;
    email: string
    password: string;
}

export interface AuthResponse {
    token: string;
}

//UserInfo for Local Storage
export interface UserInfo {
    name: string;
    email: string;
}

export interface AuthState {
    userInfo: UserInfo | null;
}