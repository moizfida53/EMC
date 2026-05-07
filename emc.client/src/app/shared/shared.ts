// emc.client/src/app/shared/shared.ts
//
// Barrel re-export — import everything shared from one place:
//   import { Pill, Button, KpiCard, PageHeader, Searchbar, Modal } from '@shared';

// ── UI Components ─────────────────────────────────────────────
export { Pill }              from './ui/pill/pill';
export type { PillTone }     from './ui/pill/pill';

export { StatusBadge }       from './ui/status-badge/status-badge';

export { Badge }             from './ui/badge/badge';
export type { Priority }     from './ui/badge/badge';

export { Button }            from './ui/button/button';
export type { ButtonVariant, ButtonSize } from './ui/button/button';

export { Card }              from './ui/card/card';

export { Input }             from './ui/input/input';

export { KpiCard }           from './ui/kpi-card/kpi-card';
export type { Trend, TrendDir } from './ui/kpi-card/kpi-card';

export { MiniBar }           from './ui/mini-bar/mini-bar';
export type { MiniBarTone }  from './ui/mini-bar/mini-bar';

export { ProductLogo }       from './ui/product-logo/product-logo';
export { BluelinkLogo }      from './ui/bluelink-logo/bluelink-logo';

// ── New shared components (added in Phase 2) ─────────────────
export { PageHeader }        from './ui/page-header/page-header';
export { Searchbar }         from './ui/searchbar/searchbar';
export type { SearchFilter } from './ui/searchbar/searchbar';
export { Modal }             from './ui/modal/modal';
export type { ModalSize }    from './ui/modal/modal';

// ── Pipes ─────────────────────────────────────────────────────
export { FormatDatePipe }    from './pipes/format-date.pipe';
export { RelativeTimePipe }  from './pipes/relative-time.pipe';
export { MaskKeyPipe }       from './pipes/mask-key.pipe';

// ── Directives ────────────────────────────────────────────────
export { ClickOutside }      from './directives/click-outside.directive';
export { ScrollThin }        from './directives/scroll-thin.directive';
