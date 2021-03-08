import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { AuthActionTypes, LogIn, LogInFailure, LogInSuccess } from '../actions/auth.actions';



@Injectable()
export class AuthEffects {
  constructor(private actions: Actions, private authService: AuthServiceService, private router: Router) {

  }

  @Effect()
  LogIn: Observable<any> = this.actions.pipe(ofType(AuthActionTypes.LOGIN)
    , map((action: LogIn) => action.payload)
    , switchMap(payload => {
      return this.authService.login(payload).pipe(map((response) => {
        console.log(response);
        if (!response.response) {
          console.log("Failed");
          alert(response[0].error.message);
          return new LogInFailure({ error: response[0].error.message });
        }
        else {
          console.log(response.response.data.accessToken);
          console.log("Success");
          alert(response.response.message);
          console.log(response.response);
          return new LogInSuccess({
            token: response.response.data.accessToken,
            refresh_token: response.response.data.refreshToken,
            username: response.response.data.uName,
            uId: response.response.data.uId
          });

        }
      })
        , catchError((error) => {
          console.log("Catch: ", error)
          return of(new LogInFailure({ error: error }));
        }));
    }));


  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user) => {
      console.log(user);
      this.router.navigateByUrl('/home');
    })
  );

  // @Effect({ dispatch: false })
  // LogInFailure: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGIN_FAILURE)
  // );

  // @Effect()
  // SignUp: Observable<any> = this.actions
  //   .ofType(AuthActionTypes.SIGNUP)
  //   .map((action: SignUp) => action.payload)
  //   .switchMap(payload => {
  //     return this.authService.signUp(payload.email, payload.password)
  //       .map((user) => {
  //         return new SignUpSuccess({ token: user.token, email: payload.email });
  //       })
  //       .catch((error) => {
  //         return Observable.of(new SignUpFailure({ error: error }));
  //       });
  //   });

  // @Effect({ dispatch: false })
  // SignUpSuccess: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.SIGNUP_SUCCESS),
  //   tap((user) => {
  //     localStorage.setItem('token', user.payload.token);
  //     this.router.navigateByUrl('/');
  //   })
  // );

  // @Effect({ dispatch: false })
  // SignUpFailure: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.SIGNUP_FAILURE)
  // );

  // @Effect({ dispatch: false })
  // public LogOut: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGOUT),
  //   tap((user) => {
  //     localStorage.removeItem('token');
  //   })
  // );

  // @Effect({ dispatch: false })
  // GetStatus: Observable<any> = this.actions
  //   .ofType(AuthActionTypes.GET_STATUS)
  //   .switchMap(payload => {
  //     return this.authService.getStatus();
  //   });
}
