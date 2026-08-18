import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LogOut } from '../../stores/actions/auth.actions';
import { AppState } from '../../stores/app.states';
import { AuthServiceService } from '../authService/auth-service.service';
import { EndPoints } from './endPoints';

/**
 * Attaches the access token to every outgoing API request and, on a 401, transparently exchanges the
 * refresh token for a new access token (POST /api/auth/token/refresh) and retries the request once.
 * If the refresh also fails, the session is cleared and the user is sent to /login.
 *
 * Replaces the old APIFactory (which was passed as request options — dropping headers — and built a
 * broken 'Authorization ' + + refreshToken value that coerced the JWT to NaN).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthServiceService, private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Never attach the access token to auth endpoints (login/oauth2/refresh) — the refresh call in
    // particular must not carry an expired access token, and must not recurse through this handler.
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    const token = this.auth.getAccessToken();
    const authReq = token ? this.withAccessToken(req, token) : req;

    return next.handle(authReq).pipe(
      catchError(err => {
        // Gate recovery on the SESSION, not the access token: a 401 while logged in — even with an
        // absent/unreadable access token (e.g. a malformed CURR_USER) — should refresh, and force a
        // logout if the refresh token is missing/invalid. A truly anonymous 401 just surfaces.
        if (err && err.status === 401 && this.auth.isLoggedIn()) {
          return this.refreshAndRetry(req, next);
        }
        return throwError(err);
      })
    );
  }

  private refreshAndRetry(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.getRefreshToken()) {
      return this.forceLogin('no refresh token');
    }
    return this.auth.refreshAccessToken().pipe(
      switchMap((res: any) => {
        const newAccess = res?.accessToken;
        if (!newAccess) {
          return this.forceLogin('refresh returned no token');
        }
        this.auth.updateAccessToken(newAccess);
        return next.handle(this.withAccessToken(req, newAccess));
      }),
      catchError(() => this.forceLogin('refresh failed'))
    );
  }

  private withAccessToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes(EndPoints.TOKEN_REFRESH)
        || url.includes(EndPoints.LOGIN)
        || url.includes(EndPoints.OAUTH2_LOGIN);
  }

  private forceLogin(reason: string): Observable<never> {
    // Reuse the app's single canonical logout path (backend logout + Auth0 SSO teardown + session
    // clear + navigate) instead of reinventing it here — see AuthEffects.LogOut.
    this.store.dispatch(new LogOut());
    return throwError(reason);
  }
}
