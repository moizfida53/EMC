// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
    title: 'Sign in · BlueLink Portal',
  },
  {
    path: 'forbidden',
    loadComponent: () => import('../app/core/http/error.interceptor').then(),
    title: '403 · BlueLink Portal',
  },

  // ── Protected (AppShell wraps all) ───────────────────────────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell/app-shell').then(m => m.AppShellComponent),
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),    title: 'Dashboard · BlueLink' },
      { path: 'support',   loadComponent: () => import('./features/support/support').then(m => m.Support),          title: 'Support · BlueLink' },
      { path: 'knowledge', loadComponent: () => import('./features/knowledge/knowledge').then(m => m.Knowledge),    title: 'Knowledge Base · BlueLink' },
      { path: 'projects',  loadComponent: () => import('./features/projects/projects').then(m => m.Projects),       title: 'Projects · BlueLink' },
      { path: 'contracts', loadComponent: () => import('./features/contracts/contracts').then(m => m.Contracts),    title: 'Contracts · BlueLink' },
      { path: 'releases',  loadComponent: () => import('./features/releases/releases').then(m => m.Releases),       title: 'Releases · BlueLink' },
    ],
  },

  { path: '**', redirectTo: '' },
];