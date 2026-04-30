// src/app/core/services/sidebar.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

const STORAGE_KEY = 'emc-portal:sidebar-collapsed';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  // ── Signals ────────────────────────────────────────────────
  private readonly _collapsed  = signal<boolean>(this._loadFromStorage());
  private readonly _mobileOpen = signal<boolean>(false);

  // ── Public readonly views ──────────────────────────────────
  readonly isCollapsed  = this._collapsed.asReadonly();
  readonly isMobileOpen = this._mobileOpen.asReadonly();

  /** True when sidebar takes up visible real-estate on desktop */
  readonly effectiveWidth = computed(() =>
    this._collapsed() ? 72 : 248
  );

  constructor() {
    // Persist collapsed state to localStorage whenever it changes
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._collapsed()));
    });
  }

  // ── Actions ───────────────────────────────────────────────
  toggleCollapse(): void {
    this._collapsed.update(v => !v);
  }

  setCollapsed(value: boolean): void {
    this._collapsed.set(value);
  }

  toggleMobile(): void {
    this._mobileOpen.update(v => !v);
  }

  openMobile(): void {
    this._mobileOpen.set(true);
  }

  closeMobile(): void {
    this._mobileOpen.set(false);
  }

  // ── Private ───────────────────────────────────────────────
  private _loadFromStorage(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  }
}