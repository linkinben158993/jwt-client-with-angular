export class User {
    uId?: string;
    username?: string;
    token?: string;
    refreshToken?: string;
    loginMethod?: 'password' | 'oauth2';
    role?: string;
    constructor(uid, username, token, refreshToken, loginMethod: 'password' | 'oauth2' = 'password', role?: string) {
        this.uId = uid;
        this.username = username;
        this.token = token;
        this.refreshToken = refreshToken;
        this.loginMethod = loginMethod;
        this.role = role;
    }
}
