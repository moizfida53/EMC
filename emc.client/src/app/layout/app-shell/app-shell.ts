// src/app/shared/components/app-shell/app-shell.component.ts
import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { SidebarComponent }  from '../sidebar/sidebar';
import { TopbarComponent }   from '../top-bar/top-bar';
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <div class="app-main">
        <app-topbar />
        <main
          class="app-content"
          id="main-content"
          role="main"
          aria-label="Page content">
          <div class="app-content__inner animate-content-rise">
            <router-outlet />
          </div>
          <footer class="page-footer">
            BlueLink Solutions · Customer Portal · © {{ year }}
          </footer>
        </main>
      </div>
  `,
  styles: [`
    :host { display: contents; }

    .app-shell {
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  protected readonly year = new Date().getFullYear();
}