
export interface UserInfo {
    user_id: string;
    name: string;
    birth: string;
    email: string;
    phone: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    location?: { lat: number; lng: number } | null;
}