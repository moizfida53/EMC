// src/app/core/auth/auth.store.ts
//
// Signal-based auth state. Holds the active user from EITHER:
//   • Microsoft Entra (MSAL `AccountInfo`)        → source: 'msal'
//   • A "demo account" picked on the login page  → source: 'demo'
//
// Demo sessions are persisted to localStorage so they survive a page refresh
// without triggering an MSAL redirect.
//
import { Injectable, signal, computed } from '@angular/core';
import { AccountInfo }                  from '@azure/msal-browser';

export interface AuthUser {
  accountId:   string;
  displayName: string;
  username:    string;                  // UPN / email
  tenantId:    string;
  jobTitle?:   string;                  // populated for demo accounts; optional for MSAL
  source?:     'msal' | 'demo';         // who set this user
}

const DEMO_USER_KEY = 'bl-portal:demo-user';

function toAuthUser(account: AccountInfo): AuthUser {
  return {
    accountId:   account.homeAccountId,
    displayName: account.name ?? account.username,
    username:    account.username,
    tenantId:    account.tenantId,
    source:      'msal',
  };
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // ── Private writable signals ───────────────────────────────────────────
  // Rehydrate any persisted demo session immediately so AuthGuard sees
  // the user as logged-in on a hard refresh of a protected route.
  private readonly _user    = signal<AuthUser | null>(this._loadDemoUser());
  private readonly _loading = signal<boolean>(false);
  private readonly _error   = signal<string | null>(null);

  // ── Public read-only projections ───────────────────────────────────────
  readonly user       = this._user.asReadonly();
  readonly loading    = this._loading.asReadonly();
  readonly error      = this._error.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isDemo     = computed(() => this._user()?.source === 'demo');

  readonly initials = computed(() => {
    const name = this._user()?.displayName ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase() || '?';
  });

  // ── Mutation helpers called by AuthService ─────────────────────────────
  /** Set user from MSAL `AccountInfo`. Clears any persisted demo session. */
  setUser(account: AccountInfo | null): void {
    if (account) {
      this._user.set(toAuthUser(account));
      this._clearDemoUser();
    } else {
      this._user.set(null);
    }
  }

  /** Set user from arbitrary fields (used by demo-account login). Persists when source==='demo'. */
  setManualUser(user: AuthUser): void {
    this._user.set(user);
    if (user.source === 'demo') {
      try { localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user)); } catch { /* ignore */ }
    }
  }

  /** Clear in-memory user AND any persisted demo session. */
  clear(): void {
    this._user.set(null);
    this._clearDemoUser();
  }

  setLoading(v: boolean):       void { this._loading.set(v); }
  setError(msg: string | null): void { this._error.set(msg); }
  clearError():                 void { this._error.set(null); }

  // ── Private ────────────────────────────────────────────────────────────
  private _loadDemoUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(DEMO_USER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthUser;
      return parsed && parsed.source === 'demo' ? parsed : null;
    } catch {
      return null;
    }
  }

  private _clearDemoUser(): void {
    try { localStorage.removeItem(DEMO_USER_KEY); } catch { /* ignore */ }
  }
}
