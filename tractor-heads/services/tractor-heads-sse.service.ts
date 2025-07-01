import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EventSource } from 'eventsource';

import { environment } from '@enviroment/environment';
import { EventTypes, SseEvent } from '@shared/services/sse/sseEvent';
import { SseService } from '@shared/services/sse/sse.service';
import { TractorHead } from '../models/tractor-head';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';
import { SseTractorHeadFilters } from './types/sse-tractor-head-filters';

@Injectable()
export class TractorHeadsSseService implements SseService<SseTractorHeadFilters, TractorHead> {

  private readonly sseEndpoint: string = 'operation/entries/tractor-head';
  private readonly destroyRef = inject(DestroyRef);

  public connect(filters: SseTractorHeadFilters): Observable<SseEvent<TractorHead>> {
    return new Observable<SseEvent<TractorHead>>((observer) => {

      const { token, ...filterValues } = filters;
      const parsedFilters = mapFiltersToHttpParams(filterValues);
      const url = `${environment.API_URL}/${this.sseEndpoint}?${parsedFilters.toString()}`;

      const eventsource = new EventSource(url, {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${token}`,
            },
          }),
      });

      eventsource.addEventListener('message', (event: MessageEvent<string>) => {
        try {
          if (!event.data) {
            return;
          }

          const parsedData = JSON.parse(event.data);
          observer.next(parsedData as SseEvent<TractorHead>);

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
