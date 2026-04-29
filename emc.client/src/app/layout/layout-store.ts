import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

type LayoutState = {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  isMobile: boolean;
};

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState<LayoutState>({
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    isMobile: false,
  }),
  withComputed(({ sidebarCollapsed }) => ({
    sidebarWidth: computed(() => sidebarCollapsed() ? '72px' : '248px'),
  })),
  withMethods((store) => ({
    toggleSidebar() {
      patchState(store, s => ({ sidebarCollapsed: !s.sidebarCollapsed }));
    },
    toggleMobileSidebar() {
      patchState(store, s => ({ mobileSidebarOpen: !s.mobileSidebarOpen }));
    },
    setMobile(isMobile: boolean) {
      patchState(store, { isMobile });
    }
  }))
);