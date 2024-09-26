import React from "react";

export interface UserData {
    name?: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface Page {
    pageName: string;
    pageImage: string;
}

export interface SocialAccount {
    profileName: string;
    profilePicture?: string;
    userPages?: Page[];
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
    accessToken: string | null;
    refreshToken: string | null;
}


export interface SocialAccountBoxProps {
    provider: string;
    profileName: string;
    profilePicture?: string;
    userPages: Page[];
}


export interface RedirectContextProps {
    isRedirected: boolean;
    setIsRedirected: React.Dispatch<React.SetStateAction<boolean>>

}



export interface StyledListItemProps {
    icon: React.ReactElement;
    text: string;
    open: boolean;
    to?: string;
    iconStyles?: React.CSSProperties;
    size?: 'small' | 'large' | 'x-large';
    onClick?: () => void;
}

export interface LoadingIconProps {
    loading: boolean;
}

export interface Account {
    provider: string;
    userPages?: Array<{ pageName: string; pageImage: string }>;
    profileName: string;
    profilePicture: string;
}


export interface SocialPreviewProps {
    text: string;
    account: Account;
    selectedLocalImage: File | null;
    selectedLibraryImage: { src: string; alt: string } | null;
    shortenedLinks: Record<string, string>;
}

export interface CharacterLimits {
    facebook: number;
    instagram: number;
    twitter: number;
    linkedin: number;
}

export interface PostData {
    content: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    image?: string;
}

