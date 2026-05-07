// src/app/core/auth/auth.service.ts
//
// Thin orchestration layer over MsalService + AuthStore.
// Pattern taken from reference:  app.ts#afterLogin() / login.ts#onMicrosoftLogin()
//
import { Injectable, inject } from '@angular/core';
import { Router }             from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  AuthenticationResult,
  AccountInfo,
} from '@azure/msal-browser';
import { filter, take } from 'rxjs/operators';
import { environment }  from 'src/environments/environment';
import { AuthStore, AuthUser } from './auth.store';

/** Shape passed to {@link AuthService.loginAsDemo}. Mirrors a row in the login page demo list. */
export interface DemoAccountInput {
  name:  string;
  email: string;
  role:  string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msal      = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);
  private readonly store     = inject(AuthStore);
  private readonly router    = inject(Router);

  // ── Expose store slices directly so components need only one import ────
  readonly user       = this.store.user;
  readonly isLoggedIn = this.store.isLoggedIn;
  readonly loading    = this.store.loading;
  readonly error      = this.store.error;
  readonly initials   = this.store.initials;

  // ── Called once from AppComponent.ngOnInit ─────────────────────────────
  // Mirrors reference: app.ts checks isLoggedIn → afterLogin OR subscribes
  // to LOGIN_SUCCESS broadcast.
  bootstrap(): void {
    const active = this.msal.instance.getActiveAccount()
      ?? this.msal.instance.getAllAccounts()[0]
      ?? null;

    if (active) {
      this.msal.instance.setActiveAccount(active);
      this.store.setUser(active);
      return;  // already authenticated — consumer decides where to route
    }

    // Listen for the redirect callback that fires after MSAL returns from
    // Azure AD. initializeAppData() in app.config already awaited
    // handleRedirectPromise(), so this will fire synchronously if the
    // redirect just landed, or async if the user clicks the login button.
    this.broadcast.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        take(1),
      )
      .subscribe((msg: EventMessage) => {
        const result = msg.payload as AuthenticationResult;
        if (result?.account) {
          this.msal.instance.setActiveAccount(result.account);
          this.store.setUser(result.account);
        }
        this.store.setLoading(false);
        this.router.navigate(['/']);
      });
  }

  // ── Trigger interactive login (redirect, consistent with interceptor) ──
  login(): void {
    this.store.setLoading(true);
    this.store.clearError();
    this.msal.loginRedirect({ scopes: environment.azureAd.scopes });
  }

  // ── Demo login (no MSAL — used by the login page's demo accounts list) ─
  /**
   * Sign in as one of the prototype demo accounts. Sets the AuthStore user
   * and persists the session to localStorage so a refresh keeps them in.
   */
  loginAsDemo(account: DemoAccountInput): void {
    const user: AuthUser = {
      accountId:   `demo-${account.email}`,
      displayName: account.name,
      username:    account.email,
      tenantId:    'demo',
      jobTitle:    account.role,
      source:      'demo',
    };
    this.store.clearError();
    this.store.setManualUser(user);
    this.router.navigate(['/']);
  }

  // ── Sign out — handles BOTH demo sessions and MSAL accounts ────────────
  logout(): void {
    // Demo session — local-only sign out, no MSAL round-trip
    if (this.store.user()?.source === 'demo') {
      this.store.clear();
      this.router.navigate(['/login']);
      return;
    }

    const account = this.msal.instance.getActiveAccount();
    this.store.clear();
    this.msal.logoutRedirect({
      account: account ?? undefined,
      postLogoutRedirectUri: environment.azureAd.redirectUri,
    });
  }

  // ── Acquire a fresh access token (used by interceptor) ────────────────
  acquireToken(): Promise<string | null> {
    const account =
      this.msal.instance.getActiveAccount()
      ?? this.msal.instance.getAllAccounts()[0];

    if (!account) return Promise.resolve(null);

    return this.msal.instance
      .acquireTokenSilent({ scopes: environment.azureAd.scopes, account })
      .then(r => r.accessToken)
      .catch(() => null);
  }

  // ── Convenience: active AccountInfo ───────────────────────────────────
  getAccount(): AccountInfo | null {
    return (
      this.msal.instance.getActiveAccount()
      ?? this.msal.instance.getAllAccounts()[0]
      ?? null
    );
  }
}