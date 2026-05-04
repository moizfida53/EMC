// src/app/app.config.ts
//
// Mirrors reference app_config.ts exactly:
//   • MSALInstanceFactory singleton
//   • MSALGuardConfigFactory with redirect interaction
//   • APP_INITIALIZER awaits initialize() + handleRedirectPromise()
//   • Single authInterceptor (NOT MsalInterceptor — avoid double-attaching)
//
import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  MsalGuard,
  MsalService,
  MsalBroadcastService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
} from '@azure/msal-browser';
import { routes }            from './app.routes';
import { environment }       from 'src/environments/environment';
import { authInterceptor }   from './core/http/auth.interceptor';
import { errorInterceptor }  from './core/http/error.interceptor';

// ── Singleton MSAL instance ────────────────────────────────────────────────
let _msalInstance: PublicClientApplication | null = null;

export function MSALInstanceFactory(): PublicClientApplication {
  if (!_msalInstance) {
    _msalInstance = new PublicClientApplication({
      auth: {
        clientId:    environment.azureAd.clientId,
        authority:   environment.azureAd.authority,
        redirectUri: environment.azureAd.redirectUri,
      },
      cache: {
        // LocalStorage: survives tab close / browser restart
        cacheLocation: BrowserCacheLocation.LocalStorage,
      },
    });
  }
  return _msalInstance;
}

// ── Guard config: redirect flow, portal scopes ─────────────────────────────
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { scopes: environment.azureAd.scopes },
  };
}

// ── App initializer: MUST await before any HTTP call fires ─────────────────
export function initializeApp() {
  return async (): Promise<void> => {
    const msalService = inject(MsalService);

    // 1. Hydrate the in-memory token cache from LocalStorage
    await msalService.instance.initialize();

    // 2. Exchange the auth-code in the URL (post-redirect) for tokens
    const result = await msalService.instance.handleRedirectPromise();

    // 3. Promote the returned account (or first cached account) to active
    if (result?.account) {
      msalService.instance.setActiveAccount(result.account);
    } else {
      const accounts = msalService.instance.getAllAccounts();
      if (accounts.length > 0) msalService.instance.setActiveAccount(accounts[0]);
    }
  };
}

// ── ApplicationConfig ──────────────────────────────────────────────────────
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),

    // Single functional interceptor chain — auth first, then error handling
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),

    // MSAL providers
    { provide: MSAL_INSTANCE,    useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    {
      provide:    APP_INITIALIZER,
      useFactory: initializeApp,
      deps:       [MsalService],
      multi:      true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};