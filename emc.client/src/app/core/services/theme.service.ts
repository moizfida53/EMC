// src/app/core/services/theme.service.ts
//
// With Bootstrap 5.3+, dark mode is driven by  data-bs-theme="dark"
// on the <html> element — Bootstrap's CSS variables switch automatically.
// ThemeService is still needed to manage the signal state, persist the
// preference, and react to the OS preference change event.
//
// What is REMOVED compared to the previous version:
//   - applyTheme: classList add/remove 'dark', setAttribute on body
//   - isInverseLayout() computed  (Bootstrap handles theming itself)
//   - body class toggling          (no longer needed)
//
// What is KEPT:
//   - Signal-based API (currentTheme, isDarkMode)
//   - localStorage persistence
//   - OS prefers-color-scheme listener

import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'bl-portal:theme';
  private readonly prefersDark  = window.matchMedia('(prefers-color-scheme: dark)');

  // ── Public signals ──────────────────────────────────────────
  readonly currentTheme = signal<Theme>(this._loadTheme());
  readonly isDarkMode   = computed(() => this.currentTheme() === 'dark');

  constructor() {
    // Apply immediately on boot — avoids FOUC
    this._applyTheme(this.currentTheme());

    // Follow OS changes only when the user has not set a manual preference
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ── Actions ─────────────────────────────────────────────────
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this._applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  // ── Private ─────────────────────────────────────────────────
  /**
   * Bootstrap 5.3 colour-mode switching:
   *   <html data-bs-theme="dark">  →  all BS CSS vars switch
   *
   * This is the ONLY DOM mutation needed. No class toggling required.
   */
  private _applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  private _loadTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return this.prefersDark.matches ? 'dark' : 'light';
  }
}