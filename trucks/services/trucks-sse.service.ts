import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventSource } from 'eventsource';
import { Observable } from 'rxjs';

import { environment } from '@enviroment/environment';
import { ConfigStore } from '@config/store/app-config.store';
import { AuthStore } from '@auth/store/auth.store';
import { Truck } from '../models/truck';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { SseService } from '@shared/services/sse/sse.service';

interface Filters {}

@Injectable()
export class TrucksSseService implements SseService<Filters, Truck> {
  private readonly sseEndpoint: string =
    'operation/entries/vehicle/subscription';

  private readonly destroyRef = inject(DestroyRef);
  private readonly configStore = inject(ConfigStore);
  private readonly authStore = inject(AuthStore);

  public connect(filters: Filters): Observable<SseEvent<Truck>> {
    return new Observable<SseEvent<Truck>>((observer) => {
      const eventsource = new EventSource(
        `${environment.API_URL}/${
          this.sseEndpoint
        }?locationId=${this.configStore.selectedLocationId()}&fromDateTime=${new Date(
          '2025-06-03T11:37:38.954Z'
        ).toISOString()}`,
        {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              headers: {
                ...init.headers,
                Authorization: `Bearer ${this.authStore.token()}`,
              },
            }),
        }
      );

      eventsource.addEventListener('message', (event: MessageEvent<string>) => {
        observer.next(JSON.parse(event.data) as SseEvent<Truck>);
      });

      eventsource.onerror = (err) => {
        observer.error(err);
      };

      return () => {
        eventsource.close();
      };
    }).pipe(takeUntilDestroyed(this.destroyRef));
  }
}
