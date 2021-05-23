import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { baseUrl } from 'src/environments/environment';
import { EndPoints } from '../API/endPoints';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly CURRENT_USER = 'CURR_USER';
  private readonly JWT_TOKEN = 'JWT_ACCESSS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_ACCESS_TOKEN';

  constructor(private http: HttpClient) {
  }

  signUp(data): Observable<any> {
    return this.http.post<any>(`${baseUrl + EndPoints.REGISTER}`, data).pipe(
      tap(result => {
        mapTo([true, result]);
      }),
      catchError(error => {
        return of([error]);
      })
    )
  }

  login(data): Observable<any> {
    return this.http.post<any>(`${baseUrl + EndPoints.LOGIN}`, data).pipe(
      tap(result => {
        // this.storeJwtToken(result.response.data.accessToken);
        // this.storeRefreshToken(result.response.data.refreshToken);
        const user = new User(
          result.response.data.accessToken,
          data.username,
          result.response.data.accessToken,
          result.response.data.refreshToken
        );
        this.storeUser(user);
        mapTo([true, result]);
      }),
      catchError(error => {
        return of([error]);
      })
    );
  }

  private storeUser(user: User): void {
    const jsonUser = JSON.stringify(user);
    localStorage.setItem(this.CURRENT_USER, jsonUser);
  }

  private storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeRefreshToken(refreshJwt: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, refreshJwt);
  }

  getJwtToken(): string {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getCurrentUser(): string {
    return localStorage.getItem(this.CURRENT_USER);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  tokenIsExpired(): boolean {
    const jsonUser = localStorage.getItem(this.CURRENT_USER);
    const user = JSON.parse(jsonUser) as User;
    let isExired = false;
    if (user?.token) {
      const payload = jwt_decode(user?.token);
      if (payload['exp'] * 1000 <= Date.now()) {
        isExired = true;
      }
    }
    return isExired;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER);
  }
}