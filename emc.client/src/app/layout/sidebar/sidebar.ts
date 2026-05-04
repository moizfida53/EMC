// sidebar.ts - Add inverse theme support
import {
  Component,
  inject,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { ThemeService } from '../../core/services/theme.service';
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
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly navItems: NavItem[] = NAV_ITEMS;
  protected readonly isCollapsed = this.sidebarService.isCollapsed;
  protected readonly isMobileOpen = this.sidebarService.isMobileOpen;

  protected readonly sidebarClasses = computed(() => ({
    'sidebar--collapsed': this.isCollapsed(),
    'sidebar--mobile-open': this.isMobileOpen(),
    'sidebar--inverse': this.themeService.isInverseLayout(), // Add inverse class
  }));

  protected readonly overlayClasses = computed(() => ({
    'sidebar-overlay--visible': this.isMobileOpen(),
  }));

  // Logo dimensions
  private readonly LOGO_ASPECT = 1600 / 351;
  
  protected readonly logoHeight = computed(() => this.isCollapsed() ? 22 : 26);
  protected readonly logoWidth = computed(() => Math.round(this.logoHeight() * this.LOGO_ASPECT));

  // Dynamic logo based on inverse theme
  protected readonly LOGO_LIGHT = '/bluelink.png';
  protected readonly LOGO_DARK = '/bluelink-white.png';
  
  protected readonly currentLogo = computed(() => 
    this.themeService.isInverseLayout() ? this.LOGO_DARK : this.LOGO_LIGHT
  );

  // Favicon for collapsed state
  protected readonly FAVICON = '/favicon.ico';

  protected isActive(href: string): boolean {
    const url = this.router.url;
    if (href === '/') return url === '/';
    return url.startsWith(href);
  }

  protected toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
  }

  protected closeOverlay(): void {
    this.sidebarService.closeMobile();
  }

  protected onNavClick(): void {
    if (window.innerWidth < 768) {
      this.sidebarService.closeMobile();
    }
  }

  protected onCsmBook(): void {
    console.info('CSM booking flow coming soon');
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isMobileOpen()) {
      this.sidebarService.closeMobile();
    }
  }

  protected trackByHref(_: number, item: NavItem): string {
    return item.href;
  }
}