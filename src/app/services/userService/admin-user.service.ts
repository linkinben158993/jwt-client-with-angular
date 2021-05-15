import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Users } from 'src/app/models/admin-users/users.model';
import { baseUrl } from 'src/environments/environment';
import { APIFactory } from '../API/apiFactory';
import { EndPoints } from '../API/endPoints';

interface GetResponse {
  data: [];
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  constructor(private httpClient: HttpClient, private apiFactory: APIFactory) {

  }

  public getAllUser(): Observable<Users[]> {
    return this.httpClient.get<GetResponse>(`${baseUrl + EndPoints.USER_ALL}`, this.apiFactory).pipe(
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

  public updateAllUnRoledUser(): Observable<any> {
    return this.httpClient.get<GetResponse>(`${baseUrl + EndPoints.USER_UPDATE_ROLE}`, this.apiFactory).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of([error]);
      })
    );
  }
}
