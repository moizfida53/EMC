import { Component, inject } from '@angular/core';
import { LayoutStore } from '../layout-store';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  //   host: {
  //   '[style.width]': 'layout.sidebarWidth()',
  //   'class': 'relative flex h-full flex-col border-r bg-surface transition-[width] duration-200 ease-out'
  // }
})
export class Sidebar {
  layout = inject(LayoutStore);

}
