// src/app/core/auth/auth.guard.ts
//
// Mirrors reference masl.guard.ts:
//   1. Try getActiveAccount()
//   2. If null, try getAllAccounts()[0] and promote it
//   3. Still null → loginRedirect + return false
//
import { inject }           from '@angular/core';
import { CanActivateFn }    from '@angular/router';
import { AuthService }      from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  // Account already set — let route activate
  if (auth.isLoggedIn()) return true;

  // Try to restore from cache (handles page refresh)
  const account = auth.getAccount();
  if (account) {
    auth.bootstrap(); // syncs store
    return true;
  }

  // No session → trigger redirect login and block route
  auth.login();
  return false;
};