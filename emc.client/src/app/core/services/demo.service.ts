import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../http/base-api.service';
import { DemoItem, DemoPing } from '../models/demo.model';

/**
 * Smoke-test service used to verify Angular ⇄ EMC.Server connectivity.
 * Hits the [Authorize]'d DemoController on the .NET side, so the auth
 * interceptor must attach a valid bearer token for these calls to succeed.
 */
@Injectable({ providedIn: 'root' })
export class DemoService {
  private api = inject(BaseApiService);

  /** GET /api/Demo/Ping — confirms auth + connectivity. */
  ping(): Observable<DemoPing> {
    return this.api.get<DemoPing>('/api/Demo/Ping');
  }

  /** GET /api/Demo/GetDemoItems — returns the mock list. */
  getDemoItems(): Observable<DemoItem[]> {
    return this.api.get<DemoItem[]>('/api/Demo/GetDemoItems');
  }

  /** GET /api/Demo/GetDemoItemById/{id} — returns one mock item. */
  getDemoItemById(id: string): Observable<DemoItem> {
    return this.api.get<DemoItem>(`/api/Demo/GetDemoItemById/${id}`);
  }
}
