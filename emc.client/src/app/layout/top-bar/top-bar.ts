// src/app/shared/components/topbar/topbar.component.ts
import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule }            from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith }  from 'rxjs/operators';
import { toSignal }                from '@angular/core/rxjs-interop';
import { SidebarService }          from '../../core/services/sidebar.service';
import { ThemeService }            from '../../core/services/theme.service';
import { NAV_ITEMS }               from '../../core/models/nav-item.model';

// ── Types ─────────────────────────────────────────────────────
interface AppUser {
  firstname: string;
  lastname:  string;
  jobtitle:  string;
  email:     string;
  initials:  string;
}

interface Activity {
  id:             string;
  type:           string;
  subject:        string;
  scheduledStart: string;
  read:           boolean;
}

// ── Mock data (replace with real service calls) ───────────────
const MOCK_USER: AppUser = {
  firstname: 'Amelia',
  lastname:  'Brooks',
  jobtitle:  'Director of IT Operations',
  email:     'amelia.brooks@northwind-energy.com',
  initials:  'AB',
};

const MOCK_COMPANY = {
  name:     'Northwind Energy Co.',
  industry: 'Utilities & Smart Grid',
  logo:     '/northwind-logo.webp',
};

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'Email',   subject: 'Re: BL-10481 Settlement run BL-04 stalled at 92%', scheduledStart: new Date().toISOString(), read: false },
  { id: '2', type: 'Meeting', subject: 'Settlement Phase 2 — Region A go-live readiness',  scheduledStart: new Date().toISOString(), read: false },
  { id: '3', type: 'Task',    subject: 'Approve SCIM deprovisioning runbook v1.2',          scheduledStart: new Date().toISOString(), read: true  },
  { id: '4', type: 'Call',    subject: 'Weekly delivery sync with BlueLink',                scheduledStart: new Date().toISOString(), read: true  },
  { id: '5', type: 'Note',    subject: 'MeterLink Wave 3 — variance in Sector 7',           scheduledStart: new Date().toISOString(), read: true  },
  { id: '6', type: 'Email',   subject: 'Release notes: GridIQ 4.18.0 (Staged 2026-05-04)', scheduledStart: new Date().toISOString(), read: true  },
];

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.html',
  styleUrls:   ['./top-bar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private  readonly sidebarService = inject(SidebarService);
  public   readonly themeService   = inject(ThemeService);  // public: used in template
  private  readonly router         = inject(Router);
  private  readonly elRef          = inject(ElementRef<HTMLElement>);

  // NOTE: topbarClasses / isInverseLayout removed.
  // Bootstrap 5.3 data-bs-theme on <html> handles all colour switching.

  // ── Data ──────────────────────────────────────────────────
  protected readonly user       = MOCK_USER;
  protected readonly company    = MOCK_COMPANY;
  protected readonly activities = MOCK_ACTIVITIES;

  // ── UI state ──────────────────────────────────────────────
  protected readonly notifOpen   = signal(false);
  protected readonly userOpen    = signal(false);
  protected readonly searchQuery = signal('');

  protected readonly unreadCount = computed(() =>
    this.activities.filter(a => !a.read).length
  );

  // ── Breadcrumbs from router ────────────────────────────────
  private readonly currentUrl$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => (e as NavigationEnd).urlAfterRedirects),
    startWith(this.router.url),
  );

  protected readonly breadcrumbs = toSignal(
    this.currentUrl$.pipe(map(url => this._buildBreadcrumbs(url))),
    { initialValue: this._buildBreadcrumbs(this.router.url) },
  );

  // ── Actions ───────────────────────────────────────────────
  protected toggleMobileSidebar(): void { this.sidebarService.toggleMobile(); }

  protected toggleNotif(): void {
    this.notifOpen.update(v => !v);
    if (this.notifOpen()) this.userOpen.set(false);
  }

  protected toggleUser(): void {
    this.userOpen.update(v => !v);
    if (this.userOpen()) this.notifOpen.set(false);
  }

  protected markAllRead(): void {
    this.activities.forEach(a => (a.read = true));
  }

  protected openSearch():  void { console.info('Command palette coming soon'); }
  protected openProfile(): void { console.info('Profile & preferences coming soon'); }
  protected openHelp():    void { console.info('Help center coming soon'); }

  protected toggleTheme(): void { this.themeService.toggleTheme(); }

  protected onSearchKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') (event.target as HTMLInputElement).blur();
  }

  protected signOut(): void {
    this.router.navigate(['/login']);
  }

  // ── Close popovers when clicking outside ─────────────────
  @HostListener('document:click', ['$event'])
  protected onDocClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target as Node)) {
      this.notifOpen.set(false);
      this.userOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.notifOpen.set(false);
    this.userOpen.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  protected onGlobalKey(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  // ── Helpers ──────────────────────────────────────────────
  protected formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  protected relativeTime(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now();
    const abs  = Math.abs(diff);
    const min  = 60_000;
    const hr   = 60 * min;
    const day  = 24 * hr;
    const past = diff < 0;
    let value: string;

    if      (abs < hr)  value = `${Math.max(1, Math.round(abs / min))} min`;
    else if (abs < day) value = `${Math.round(abs / hr)} h`;
    else                value = `${Math.round(abs / day)} d`;

    return past ? `${value} ago` : `in ${value}`;
  }

  private _buildBreadcrumbs(url: string): { label: string; href: string }[] {
    const crumbs = [{ label: 'Workspace', href: '/' }];
    const match  = NAV_ITEMS.find(n => n.href === url || (n.href !== '/' && url.startsWith(n.href)));

    if (match && match.href !== '/') crumbs.push({ label: match.label, href: match.href });
    else if (url === '/')            crumbs.push({ label: 'Dashboard', href: '/' });

    return crumbs;
  }
}