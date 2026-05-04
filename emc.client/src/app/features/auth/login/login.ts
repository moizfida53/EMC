import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router }       from '@angular/router';
import { AuthService }  from '../../../core/auth/auth.service';
import { BluelinkLogo } from '../../../shared/ui/bluelink-logo/bluelink-logo';
import { Input } from "@shared";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, BluelinkLogo, Input],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error   = signal<string | null>(null);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.auth.bootstrap();
  }

  protected onLogin(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login();
  }
}