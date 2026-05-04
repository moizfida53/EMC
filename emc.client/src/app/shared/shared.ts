// emc.client/src/app/shared/shared.ts
//
// Barrel re-export — import everything shared from one place:
//   import { Pill, Button, KpiCard, FormatDatePipe } from '@shared';
//
// You can configure the @shared path alias in tsconfig.json:
//   "paths": { "@shared": ["src/app/shared/shared.ts"] }

// ── UI Components ─────────────────────────────────────────────
export { Pill }            from './ui/pill/pill';
export type { PillTone }   from './ui/pill/pill';

export { StatusBadge }     from './ui/status-badge/status-badge';

export { Badge }           from './ui/badge/badge';
export type { Priority }   from './ui/badge/badge';

export { Button }          from './ui/button/button';
export type { ButtonVariant, ButtonSize } from './ui/button/button';

export { Card }            from './ui/card/card';

export { Input }           from './ui/input/input';

export { KpiCard }         from './ui/kpi-card/kpi-card';
export type { Trend, TrendDir, MiniBarTone } from './ui/kpi-card/kpi-card';

export { MiniBar }         from './ui/mini-bar/mini-bar';

export { SectionHeader }   from './ui/section-header/section-header';

export { ProductLogo }     from './ui/product-logo/product-logo';

export { BluelinkLogo }    from './ui/bluelink-logo/bluelink-logo';

// ── Pipes ─────────────────────────────────────────────────────
export { FormatDatePipe }  from './pipes/format-date.pipe';
export { RelativeTimePipe }from './pipes/relative-time.pipe';
export { MaskKeyPipe }     from './pipes/mask-key.pipe';

// ── Directives ────────────────────────────────────────────────
export { ClickOutside }    from './directives/click-outside.directive';
export { ScrollThin }      from './directives/scroll-thin.directive';