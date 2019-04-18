export interface SignupDto {
    steemuser: string;
    wif: string;
}

export interface AccessTokenDto {
    access_token: string;
    status: string;
}

export interface StravaTokenResult {
    token_type: string;
    access_token: string;
    athlete: any;
    refresh_token: string
    expires_at: number;
    state: string
}

export interface StravaRefreshResult {
    token_type: string;
    access_token: string;
    refresh_token: string
    expires_at: number;
}