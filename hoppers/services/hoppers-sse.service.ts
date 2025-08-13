import { DestroyRef, inject, Injectable } from "@angular/core";
import { SseService } from "@shared/services/sse/sse.service";
import { HopperEvent } from "../models/hopper-event";
import { Observable } from "rxjs";
import { SseEvent } from "@shared/services/sse/sseEvent";
import { mapFiltersToHttpParams } from "@shared/services/http/httpParamsMapper";
import { environment } from "@enviroment/environment";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventSource } from 'eventsource';

export interface OptionalFilters {
  fromDatetime?: string;
  toDatetime?: string;
};

export interface RequiredFilters {
  locationId: number;
  hopperId: number;
  token: string;
};

export type SseHoppersFilters = RequiredFilters & Partial<OptionalFilters>;

@Injectable()
export class HoppersSseService implements SseService<SseHoppersFilters, HopperEvent> {
  private sseEndpoint: string = '';

  private readonly destroyRef = inject(DestroyRef);

  public connect(filters: SseHoppersFilters): Observable<SseEvent<HopperEvent>> {
    this.sseEndpoint = `operation/hoppers/${filters.hopperId}/events/subscription`;
    
    return new Observable<SseEvent<HopperEvent>>((observer) => {
      const { token, ...filterValues } = filters;
      const parsedFilters = mapFiltersToHttpParams(filterValues);

      const eventsource = new EventSource(
        `${environment.API_URL}/${
          this.sseEndpoint
        }?${parsedFilters.toString()}`,
        {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              headers: {
                ...init.headers,
                Authorization: `Bearer ${token}`,
              },
            }),
        }
      );

      eventsource.addEventListener('message', (event: MessageEvent<string>) => {
        observer.next(JSON.parse(event.data) as SseEvent<HopperEvent>);
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
