export interface UserData {
    name?: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface SocialAccount {
    profileName: string;
    profilePicture?: string;
}

export interface UserInfo {
    name?: string;
    email: string;
    socialAccounts?: {
        [provider: string]: SocialAccount;
    };
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface AuthState {
    userInfo: UserInfo | null;
}

export interface SocialAccountBoxProps {
    provider: string;
    profileName: string;
    profilePicture?: string;
}
