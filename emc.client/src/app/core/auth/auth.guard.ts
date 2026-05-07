// src/app/core/auth/auth.guard.ts
//
// Route guard for protected routes. Order:
//   1. AuthStore already has a user (MSAL or demo) → allow.
//   2. MSAL has a cached account but the store is empty → sync via bootstrap()
//      and allow.
//   3. No session at all → redirect to the in-app /login page.
//
// IMPORTANT: do NOT call auth.login() here. That kicks the user straight to
// login.microsoftonline.com without ever showing them our login page (with
// SSO, Microsoft, and demo-account options).
//
import { inject }                     from '@angular/core';
import { CanActivateFn, Router }      from '@angular/router';
import { AuthService }                from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // 1. Already authenticated (either MSAL or demo) → let the route activate.
  if (auth.isLoggedIn()) return true;

  // 2. MSAL has a cached account from a previous session → sync the store.
  const account = auth.getAccount();
  if (account) {
    auth.bootstrap();
    return true;
  }

  // 3. No session → redirect to our in-app login page so the user can pick
  //    SSO / Microsoft / a demo account. createUrlTree is the canonical
  //    way for a guard to express a redirect.
  return router.createUrlTree(['/login']);
};
