import { Component  } from '@angular/core';
import { AppShellComponent } from "./layout/app-shell/app-shell";
import { RouterOutlet } from "@angular/router";


@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [AppShellComponent, RouterOutlet]
})
export class App {

}
