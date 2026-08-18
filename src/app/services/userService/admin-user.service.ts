import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Users } from 'src/app/models/admin-users/users.model';
import { baseUrl } from 'src/environments/environment';
import { EndPoints } from '../API/endPoints';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  // Auth headers are attached centrally by AuthInterceptor — no per-call header wiring needed.
  constructor(private httpClient: HttpClient) {

  }

  public getAllUser(): Observable<Users[]> {
    // Contract-first (O-4b): GET /api/users returns a flat top-level array of UserResponse — no envelope.
    return this.httpClient.get<Users[]>(`${baseUrl + EndPoints.USER_ALL}`).pipe(
      map((users) => users),
      catchError((error) => {
        // console.log('From service:', error);
        return of([error]);
      })
    );
  }

  public getUserProfile(token: string): Observable<any> {
    // GET /api/users/me → flat UserProfileResponse {email, fullName, role}. The interceptor attaches
    // Authorization centrally; the explicit header is kept for callers that pass a token directly.
    return this.httpClient.get<any>(
      `${baseUrl + EndPoints.USER_ME}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      map(res => res?.data ?? res),
      catchError(error => of(null))
    );
  }

  public updateAllUnRoledUser(): Observable<any> {
    return this.httpClient.get<any>(`${baseUrl + EndPoints.USER_UPDATE_ROLE}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of([error]);
      })
    );
  }
}
