// src/app/shared/components/sidebar/sidebar.component.ts
import {
  Component,
  inject,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarService }      from '../../core/services/sidebar.service';
import { NAV_ITEMS, NavItem }  from '../../core/models/nav-item.model';

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
  private   readonly router         = inject(Router);

  // ── Nav items ─────────────────────────────────────────────
  protected readonly navItems: NavItem[] = NAV_ITEMS;

  // ── Computed states from signals ──────────────────────────
  protected readonly isCollapsed  = this.sidebarService.isCollapsed;
  protected readonly isMobileOpen = this.sidebarService.isMobileOpen;

  /** CSS classes on the root .sidebar element */
  protected readonly sidebarClasses = computed(() => ({
    'sidebar--collapsed':    this.isCollapsed(),
    'sidebar--mobile-open':  this.isMobileOpen(),
  }));

  /** CSS classes on the overlay */
  protected readonly overlayClasses = computed(() => ({
    'sidebar-overlay--visible': this.isMobileOpen(),
  }));

  // ── Logo dimensions ───────────────────────────────────────
  // Aspect ratio of the BlueLink logo PNG: 1600 / 351
  private readonly LOGO_ASPECT = 1600 / 351;

  protected readonly logoHeight = computed(() =>
    this.isCollapsed() ? 22 : 26
  );

  protected readonly logoWidth = computed(() =>
    Math.round(this.logoHeight() * this.LOGO_ASPECT)
  );

  // ── Logo sources ──────────────────────────────────────────
  protected readonly LOGO_LIGHT = 'assets/images/bluelink-logo-light.png';
  protected readonly LOGO_DARK  = 'assets/images/bluelink-logo-dark.png';

  // ── Active route detection ────────────────────────────────
  protected isActive(href: string): boolean {
    const url = this.router.url;
    if (href === '/') return url === '/';
    return url.startsWith(href);
  }

  // ── Actions ───────────────────────────────────────────────
  protected toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
  }

  protected closeOverlay(): void {
    this.sidebarService.closeMobile();
  }

  protected onNavClick(): void {
    // On mobile, close the sidebar drawer after navigation
    if (window.innerWidth < 768) {
      this.sidebarService.closeMobile();
    }
  }

  protected onCsmBook(): void {
    // Placeholder: open booking flow
    console.info('CSM booking flow coming soon');
  }

  // ── Keyboard: close mobile on Escape ─────────────────────
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isMobileOpen()) {
      this.sidebarService.closeMobile();
    }
  }

  // ── Track nav items for performance ──────────────────────
  protected trackByHref(_: number, item: NavItem): string {
    return item.href;
  }
}