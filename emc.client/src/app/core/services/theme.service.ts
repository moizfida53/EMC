// src/app/shared/core/services/theme.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  currentTheme = signal<Theme>('light');
  isDarkMode = computed(() => this.currentTheme() === 'dark');
  
  // For inverse layout (sidebar/topbar opposite to main theme)
  isInverseLayout = computed(() => this.isDarkMode()); // When dark theme, inverse the bars

  constructor() {
    // Load saved preference or system preference
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const systemPrefers = this.prefersDark.matches ? 'dark' : 'light';
    this.currentTheme.set(saved || systemPrefers);
    this.applyTheme(this.currentTheme());
    
    // Watch system preference changes (only if no user preference saved)
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: Theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');
    }
  }
}