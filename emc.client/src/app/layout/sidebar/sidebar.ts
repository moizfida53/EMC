// src/app/shared/components/sidebar/sidebar.component.ts
import {
  Component,
  inject,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { ThemeService }   from '../../core/services/theme.service';
import { NAV_ITEMS, NavItem } from '../../core/models/nav-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly themeService   = inject(ThemeService);
  private   readonly router         = inject(Router);

  protected readonly navItems    = NAV_ITEMS as NavItem[];
  protected readonly isCollapsed = this.sidebarService.isCollapsed;
  protected readonly isMobileOpen = this.sidebarService.isMobileOpen;

  // ── CSS class maps ─────────────────────────────────────────
  // NOTE: isInverseLayout removed — Bootstrap 5.3 handles light/dark
  // via data-bs-theme on <html>; no extra class needed on the sidebar.
  protected readonly sidebarClasses = computed(() => ({
    'sidebar--collapsed':    this.isCollapsed(),
    'sidebar--mobile-open': this.isMobileOpen(),
  }));

  protected readonly overlayClasses = computed(() => ({
    'sidebar-overlay--visible': this.isMobileOpen(),
  }));

  // ── Logo ───────────────────────────────────────────────────
  // Switch between colour and white logo based on Bootstrap theme.
  // Bootstrap sets data-bs-theme="dark" on <html>; ThemeService.isDarkMode
  // is the Angular-signal projection of that state.
  private  readonly LOGO_LIGHT = '/bluelink.png';
  private  readonly LOGO_DARK  = '/bluelink-white.png';
  protected readonly FAVICON   = '/favicon.ico';

  private readonly LOGO_ASPECT = 1600 / 351;
  protected readonly logoHeight = computed(() => this.isCollapsed() ? 22 : 26);
  protected readonly logoWidth  = computed(() =>
    Math.round(this.logoHeight() * this.LOGO_ASPECT)
  );
  protected readonly currentLogo = computed(() =>
    this.themeService.isDarkMode() ? this.LOGO_DARK : this.LOGO_LIGHT
  );

  // ── Helpers ────────────────────────────────────────────────
  protected isActive(href: string): boolean {
    const url = this.router.url;
    return href === '/' ? url === '/' : url.startsWith(href);
  }

  protected toggleCollapse(): void { this.sidebarService.toggleCollapse(); }
  protected closeOverlay():   void { this.sidebarService.closeMobile(); }

  protected onNavClick(): void {
    if (window.innerWidth < 768) this.sidebarService.closeMobile();
  }

  protected onCsmBook(): void {
    // TODO: open meeting scheduler
    console.info('CSM booking flow coming soon');
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isMobileOpen()) this.sidebarService.closeMobile();
  }

  protected trackByHref(_: number, item: NavItem): string {
    return item.href;
  }
}