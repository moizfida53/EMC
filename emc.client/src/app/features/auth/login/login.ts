// src/app/features/auth/login/login.ts
import {
  Component, ChangeDetectionStrategy, inject, OnInit, signal,
} from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { Router }          from '@angular/router';
import { AuthService }     from '../../../core/auth/auth.service';
import { BluelinkLogo }    from '../../../shared/ui/bluelink-logo/bluelink-logo';
import { Button }          from '@shared';
import { environment }     from 'src/environments/environment';

interface DemoAccount {
  initials: string;
  name:     string;
  role:     string;
  email:    string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BluelinkLogo, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  // ── UI state ──────────────────────────────────────────────
  protected readonly loading        = signal(false);
  protected readonly error          = signal<string | null>(null);
  protected readonly email          = signal('amelia.brooks@northwind-energy.com');
  protected readonly password       = signal('');
  protected readonly remember       = signal(true);
  protected readonly showPassword   = signal(false);

  // ── Demo accounts (dev mode only) ─────────────────────────
  protected readonly showDemoAccounts = !environment.production;
  protected readonly demoAccounts: DemoAccount[] = [
    { initials: 'AB', name: 'Amelia Brooks',  role: 'Director of IT Operations',     email: 'amelia.brooks@northwind-energy.com' },
    { initials: 'ML', name: 'Marc Lefevre',   role: 'Head of Smart Grid Engineering', email: 'marc.lefevre@northwind-energy.com'  },
  ];

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.auth.bootstrap();
  }

  // ── Handlers ──────────────────────────────────────────────
  protected onLogin(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login();
  }

  protected onSso(): void {
    this.onLogin();
  }

  protected onSubmitEmail(): void {
    if (!this.email().trim()) {
      this.error.set('Please enter your work email.');
      return;
    }
    if (!this.password().trim()) {
      this.error.set('Please enter your password.');
      return;
    }
    // If the entered email matches one of the demo accounts, do a demo login
    // instead of going through MSAL (handy in dev mode).
    const match = this.demoAccounts.find(
      a => a.email.toLowerCase() === this.email().trim().toLowerCase(),
    );
    if (match) {
      this.auth.loginAsDemo({ name: match.name, email: match.email, role: match.role });
      return;
    }
    // Otherwise: real flow through MSAL.
    this.onLogin();
  }

  /** Click on a demo account row → populate the form AND log straight in as that user. */
  protected useDemoAccount(acc: DemoAccount): void {
    this.email.set(acc.email);
    this.password.set('bluelink');
    this.error.set(null);
    this.auth.loginAsDemo({ name: acc.name, email: acc.email, role: acc.role });
  }

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
