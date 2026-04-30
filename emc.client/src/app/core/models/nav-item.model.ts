// src/app/core/models/nav-item.model.ts

export interface NavItem {
  /** Router path */
  href: string;
  /** Display label */
  label: string;
  /** Lucide icon name (string) — resolved in component via icon map */
  icon: string;
  /** Optional badge count */
  badge?: number | string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/',           label: 'Dashboard',          icon: 'layout-dashboard' },
  { href: '/support',    label: 'Support Center',      icon: 'life-buoy',        badge: 6 },
  { href: '/knowledge',  label: 'Knowledge Base',      icon: 'book-open' },
  { href: '/projects',   label: 'Projects',            icon: 'folder-kanban' },
  { href: '/contracts',  label: 'Contracts & Licenses',icon: 'file-signature' },
  { href: '/releases',   label: 'Release Hub',         icon: 'rocket' },
];