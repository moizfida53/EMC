// src/app/core/auth/auth.store.ts
//
// Signal-based auth state.  Mirrors what the reference app keeps in
// component-level variables (isLoading, errorMessage, cashierProfile)
// but lifted to a singleton so any component can read it.
//
import { Injectable, signal, computed } from '@angular/core';
import { AccountInfo }                  from '@azure/msal-browser';

export interface AuthUser {
  accountId:   string;
  displayName: string;
  username:    string; // UPN / email
  tenantId:    string;
}

function toAuthUser(account: AccountInfo): AuthUser {
  return {
    accountId:   account.homeAccountId,
    displayName: account.name ?? account.username,
    username:    account.username,
    tenantId:    account.tenantId,
  };
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // ── Private writable signals ───────────────────────────────────────────
  private readonly _user       = signal<AuthUser | null>(null);
  private readonly _loading    = signal<boolean>(false);
  private readonly _error      = signal<string | null>(null);

  // ── Public read-only projections ───────────────────────────────────────
  readonly user       = this._user.asReadonly();
  readonly loading    = this._loading.asReadonly();
  readonly error      = this._error.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly initials   = computed(() => {
    const name = this._user()?.displayName ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase() || '?';
  });

  // ── Mutation helpers called by AuthService ─────────────────────────────
  setUser(account: AccountInfo | null): void {
    this._user.set(account ? toAuthUser(account) : null);
  }

  setLoading(v: boolean):        void { this._loading.set(v); }
  setError(msg: string | null):  void { this._error.set(msg); }
  clearError():                  void { this._error.set(null); }
}