import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';

const CURRENT_USER = 'CURR_USER';

@Injectable({
    providedIn: 'root'
})
export class APIFactory {
    public headers = {
        access_token: 'Bearer ' + (JSON.parse(localStorage.getItem(CURRENT_USER)) as User)?.token || '',
        refresh_token: 'Authorization ' + + (JSON.parse(localStorage.getItem(CURRENT_USER)) as User)?.refreshToken || '',
    };
};
