import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
export interface WeatherForecast {
  TemperatureC: number;
  TemperatureF: number;
  Summary: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast')
      .pipe()
      .subscribe({
        next: (result) => this.forecasts = result,
        error: (err) => console.error(err)
      });
  }

  protected readonly title = signal('emc.client');
}
