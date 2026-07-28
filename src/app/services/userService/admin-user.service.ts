import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Users } from 'src/app/models/admin-users/users.model';
import { baseUrl } from 'src/environments/environment';
import { EndPoints } from '../API/endPoints';

interface GetResponse {
  data: [];
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  // Auth headers are attached centrally by AuthInterceptor — no per-call header wiring needed.
  constructor(private httpClient: HttpClient) {

  }

  public getAllUser(): Observable<Users[]> {
    return this.httpClient.get<GetResponse>(`${baseUrl + EndPoints.USER_ALL}`).pipe(
      map((userItem) => {
        // Can do some effect here?
        // console.log('From service:', userItem);
        return userItem.data;
      }),
      catchError((error) => {
        // console.log('From service:', error);
        return of([error]);
      })
    );
  }

  public getUserProfile(token: string): Observable<any> {
    return this.httpClient.get<any>(
      `${baseUrl + EndPoints.USER_ME}`,
      { headers: { access_token: `Bearer ${token}` } }
    ).pipe(
      map(res => res?.data ?? res),
      catchError(error => of(null))
    );
  }

  public updateAllUnRoledUser(): Observable<any> {
    return this.httpClient.get<GetResponse>(`${baseUrl + EndPoints.USER_UPDATE_ROLE}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of([error]);
      })
    );
  }
}
