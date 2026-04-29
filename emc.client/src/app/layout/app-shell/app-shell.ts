import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "../sidebar/sidebar";
import { TopBar } from "../top-bar/top-bar";
import { LayoutStore } from '../layout-store';

@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, Sidebar, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  layout = inject(LayoutStore);
  // constructor() {
  //   // Respond to breakpoint changes with CDK BreakpointObserver
  //   const breakpoints = inject(BreakpointObserver);
  //   breakpoints.observe(Breakpoints.Handset)
  //     .pipe(takeUntilDestroyed())
  //     .subscribe(result => this.layout.setMobile(result.matches));
  // }
}
