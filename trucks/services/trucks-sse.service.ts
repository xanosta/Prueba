import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventSource } from 'eventsource';
import { Observable } from 'rxjs';

import { environment } from '@enviroment/environment';
import { Truck, TruckState } from '../models/truck';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { SseService } from '@shared/services/sse/sse.service';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

type OptionalFilters = {
  plate: string;
  originLocationIds: Array<number>;
  currentState: Array<TruckState>;
  residueTypes: Array<ResidueType>;
  fromDateTime: Date;
  toDateTime: Date;
};

type RequiredFilters = {
  locationId: number;
  token: string;
};

export type SseTruckFilters = RequiredFilters & Partial<OptionalFilters>;

@Injectable()
export class TrucksSseService implements SseService<SseTruckFilters, Truck> {
  private readonly sseEndpoint: string =
    'operation/entries/vehicle/subscription';

  private readonly destroyRef = inject(DestroyRef);

  public connect(filters: SseTruckFilters): Observable<SseEvent<Truck>> {
    return new Observable<SseEvent<Truck>>((observer) => {
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
