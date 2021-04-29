import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { NotificationService } from 'src/app/services/notificationService/notification.service';
import { AuthActionTypes, LogIn, LogInFailure, LogInSuccess, SignUp, SignUpSuccess, SignUpFailure } from '../actions/auth.actions';



@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthServiceService,
    private router: Router,
    private message: NotificationService) {
  }

  Login = createEffect(() => {
    return this.actions.pipe(ofType(AuthActionTypes.LOGIN)
      , map((action: LogIn) => action.payload)
      , switchMap(payload => {
        return this.authService.login(payload).pipe(map((response) => {
          if (!response.response) {
            return new LogInFailure({ error: response[0].error.message });
          }
          else {
            this.message.showNotification('Login Success!', 5);
            return new LogInSuccess({
              token: response.response.data.accessToken,
              refresh_token: response.response.data.refreshToken,
              username: response.response.data.uName,
              uId: response.response.data.uId
            });
          }
        })
          , catchError((error) => {
            return of(new LogInFailure(error));
          }));
      }));
  });

  LogInSuccess: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCESS),
      tap((user: LogInSuccess) => {
        console.log('Login success dispatch!', user);
        this.router.navigateByUrl('/home');
      }),
    );
  }, { dispatch: false });

  LogInFailure: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_FAILURE),
      tap((error: LogInFailure) => {
        this.message.showNotification(error.payload.error, 5);
      })
    );
  }, { dispatch: false });

  SignUp: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP)
      , map((action: SignUp) => action.payload)
      , tap(payload => {
        console.log(payload);
        return new SignUpSuccess(payload);
        // return this.authService.signUp(payload.email, payload.password)
        //   .map((user) => {
        //     return new SignUpSuccess({ token: user.token, email: payload.email });
        //   })
        //   .catch((error) => {
        //     return of(new SignUpFailure({ error: error }));
        //   });
      }));
  });

  SignUpSuccess: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP_SUCCESS),
      tap((user) => {
        // localStorage.setItem('token', user.payload.token);
        this.router.navigateByUrl('/');
      })
    );
  }, { dispatch: false });

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
