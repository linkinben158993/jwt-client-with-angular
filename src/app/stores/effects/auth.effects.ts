import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { NotificationService } from 'src/app/services/notificationService/notification.service';
import { AuthActionTypes, LogIn, LogInFailure, LogInSuccess, SignUp, SignUpFailure, SignUpSuccess } from '../actions/auth.actions';



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
              refreshToken: response.response.data.refreshToken,
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
        console.log(error);
      })
    );
  }, { dispatch: false });

  SignUp = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP)
      , map((action: SignUp) => action.payload)
      , switchMap(payload => {
        console.log('Sign Up Payload:', payload);
        return this.authService.signUp(payload).pipe(
          map((newUser) => {
            if (newUser[0].error) {
              console.log('Error New User:', newUser);
              return new SignUpFailure({ error: newUser[0].error.message });
            }
            console.log('New User:', newUser);
            return new SignUpSuccess({ newUser });
          }),
          catchError((error) => {
            console.log('Error From Auth Effect:', error);
            return of(new SignUpFailure({ error: 'Something happened!' }));
          })
        );
      }));
  });

  SignUpSuccess: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP_SUCCESS),
      tap((user) => {
        console.log('Sign Up Success:', user);
        // localStorage.setItem('token', user.payload.token);
        // this.router.navigateByUrl('/');
      })
    );
  }, { dispatch: false });

  SignUpFailure: Observable<any> = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP_FAILURE),
      tap((error) => {
        console.log('Sign Up Fail:', error);
      })
    );
  }, { dispatch: false });

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
