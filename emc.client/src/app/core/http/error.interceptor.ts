// src/app/core/http/error.interceptor.ts
//
// Handles HTTP-level errors AFTER the auth interceptor has already
// attached the token.  If the API returns 401 the token was valid but
// the server rejected it (e.g. revoked) — sign out cleanly.
//
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject }     from '@angular/core';
import { Router }     from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService }from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          // Server says token is invalid — force re-login
          console.warn('[errorInterceptor] 401 — signing out');
          auth.logout();
          break;

        case 403:
          console.warn('[errorInterceptor] 403 Forbidden:', req.url);
          router.navigate(['/forbidden']);
          break;

        case 0:
          // Network down / CORS / server not reachable
          console.error('[errorInterceptor] Network error:', req.url);
          break;

        default:
          if (err.status >= 500) {
            console.error(`[errorInterceptor] ${err.status} Server error:`, err.message);
          }
      }

      return throwError(() => err);
    }),
  );
};