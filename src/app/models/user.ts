export class User {
    uId?: string;
    username?: string;
    token?: string;
    refreshToken?: string;
    constructor(uid, username, token, refreshToken) {
        this.uId = uid;
        this.username = username;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
