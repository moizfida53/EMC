// src/app/core/http/auth.interceptor.ts
//
// Direct port of reference auth_interceptor.ts.
// Key behaviour:
//   • acquireTokenSilent → attach Bearer header
//   • timed_out BrowserAuthError → loginRedirect (not popup)
//   • InteractionRequiredAuthError → loginRedirect
//   • POST/PUT/PATCH → also set Content-Type + Accept headers
//
import { HttpInterceptorFn }    from '@angular/common/http';
import { inject }               from '@angular/core';
import { from, throwError }     from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  InteractionRequiredAuthError,
  BrowserAuthError,
} from '@azure/msal-browser';
import { AuthService }          from '../auth/auth.service';
import { environment }          from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth    = inject(AuthService);
  const account = auth.getAccount();

  // Public request (no account yet) — pass through unmodified
  if (!account) return next(req);

  return from(auth.acquireToken()).pipe(
    switchMap(token => {
      if (!token) return next(req);

      let headers = req.headers.set('Authorization', `Bearer ${token}`);

      // JSON content headers for mutating methods
      if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
        headers = headers
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');
      }

      return next(req.clone({ headers }));
    }),

    catchError(err => {
      // MSAL not ready — redirect to get a clean token
      if (err instanceof BrowserAuthError && err.errorCode === 'timed_out') {
        console.warn('[authInterceptor] timed_out — redirecting to login');
        auth.login();
        return throwError(() => err);
      }

      // Token expired or consent required
      if (err instanceof InteractionRequiredAuthError) {
        console.warn('[authInterceptor] interaction required — redirecting');
        auth.login();
        return throwError(() => err);
      }

      console.error('[authInterceptor] unhandled error:', err);
      return throwError(() => err);
    }),
  );
};