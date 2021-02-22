import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly JWT_TOKEN = 'JWT_ACCESSS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_ACCESS_TOKEN';

  constructor(private http: HttpClient) { }

  login(data): Observable<any> {
    return this.http.post<any>(`${baseUrl}authenticate/login`, data).pipe(
      tap(result => {
        this.storeJwtToken(result.response.data);
        mapTo([true, result]);
      }),
      catchError(error =>{
        return of([error]);
      })
    );
  }

  private storeJwtToken(jwt: string){
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getJwtToken(){
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn(){
    return !!this.getJwtToken();
  }

  logout(){
    localStorage.removeItem(this.JWT_TOKEN);
  }
}
