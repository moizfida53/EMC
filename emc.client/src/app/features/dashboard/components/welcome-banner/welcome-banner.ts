// src/app/features/dashboard/components/welcome-banner/welcome-banner.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterModule }    from '@angular/router';
import { AuthService }     from '../../../../core/auth/auth.service';
import { MockDataService } from '../../../../core/mock/mock-data.service';
import { Button } from '@shared';

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  imports: [RouterModule,Button],
  templateUrl: './welcome-banner.html',
  styleUrl: './welcome-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBanner {
  private readonly auth = inject(AuthService);
  private readonly data = inject(MockDataService);

  protected readonly firstname = computed(() =>
    this.auth.user()?.displayName?.split(' ')[0] ?? 'there'
  );

  protected readonly today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long',
  });

  protected readonly activeTickets = computed(() =>
    this.data.cases().filter(c => c.status === 'Active').length
  );

  protected readonly expiringLicenses = computed(() =>
    this.data.expiringLicenses(30).length
  );
}