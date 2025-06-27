
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EventSource } from 'eventsource';

import { environment } from '@enviroment/environment';
import { ConfigStore } from '@config/store/app-config.store';
import { AuthStore } from '@auth/store/auth.store';
import { EventTypes, SseEvent } from '@shared/services/sse/sseEvent';
import { SseService } from '@shared/services/sse/sse.service';
import { TractorHead } from '../models/tractor-head';
import { TractorHeadFilters } from '../models/tractor-head-filters';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

@Injectable()
export class TractorHeadsSseService implements SseService<TractorHeadFilters, TractorHead> {
  private readonly sseEndpoint: string = 'operation/entries/tractor-head';

  private readonly destroyRef = inject(DestroyRef);
  private readonly configStore = inject(ConfigStore);
  private readonly authStore = inject(AuthStore);

  public connect(filters: TractorHeadFilters): Observable<SseEvent<TractorHead>> {
    return new Observable<SseEvent<TractorHead>>((observer) => {
      const params = mapFiltersToHttpParams(filters);
      // const url = `${environment.API_URL}/${this.sseEndpoint}?${params.toString()}`;
      const url = `${environment.API_URL}/${this.sseEndpoint}?locationId=2`;


      const eventsource = new EventSource(url, {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${this.authStore.token()}`,
            },
          }),
      });

      eventsource.addEventListener('message', (event: MessageEvent<string>) => {
        try {
          if (!event.data) {
            return;
          }

          const parsedData = JSON.parse(event.data);

          if (parsedData.action && parsedData.data) {

            observer.next(parsedData as SseEvent<TractorHead>);
          } else {

            const sseEvent: SseEvent<TractorHead> = {
              action: EventTypes.LOAD,
              data: parsedData,
            };
            observer.next(sseEvent);
          }
        } catch (error) {
          console.error('Error al parsear el evento SSE:', {
            error,
            rawData: event.data,
          });
        }
      });

      eventsource.onerror = (err) => {
        console.error('Fallo en EventSource:', err);
      };

      return () => {
        eventsource.close();
      };
    }).pipe(takeUntilDestroyed(this.destroyRef));
  }
}

