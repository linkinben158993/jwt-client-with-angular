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

  loginWithCredential(credential: string): Observable<any> {
    return this.http.post<any>(`${baseUrl + EndPoints.OAUTH2_LOGIN}`, { credential }).pipe(
      tap(result => {
        if (result?.response?.data) {
          const user = new User(
            result.response.data.uId,
            result.response.data.uName,
            result.response.data.accessToken,
            result.response.data.refreshToken,
            'oauth2',
            result.response.data.role
          );
          this.storeUser(user);
        }
      }),
      catchError(error => of([error]))
    );
  }

  login(data): Observable<any> {
    return this.http.post<any>(`${baseUrl + EndPoints.LOGIN}`, data).pipe(
      tap(result => {
        const user = new User(
          result.response.data.uId,
          result.response.data.uName,
          result.response.data.accessToken,
          result.response.data.refreshToken,
          'password',
          result.response.data.role
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

  getAccessToken(): string | null {
    const raw = localStorage.getItem(this.CURRENT_USER);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as User).token ?? null;
    } catch {
      return null;
    }
  }

  getRefreshToken(): string | null {
    const raw = localStorage.getItem(this.CURRENT_USER);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as User).refreshToken ?? null;
    } catch {
      return null;
    }
  }

  // Overwrite the stored access token in CURR_USER after a successful refresh.
  updateAccessToken(newAccessToken: string): void {
    const raw = localStorage.getItem(this.CURRENT_USER);
    if (!raw) return;
    const user = JSON.parse(raw) as User;
    user.token = newAccessToken;
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  // POST /api/auth/token/refresh with the refresh token; backend returns a fresh access token.
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${baseUrl + EndPoints.TOKEN_REFRESH}`, {}, {
      headers: { refresh_token: `Bearer ${refreshToken}` }
    });
  }

  logoutBackend(accessToken: string): Observable<any> {
    return this.http.post<any>(
      `${baseUrl + EndPoints.LOGOUT}`,
      {},
      { headers: { access_token: `Bearer ${accessToken}` } }
    ).pipe(
      catchError(() => of(null))
    );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER);
  }
}