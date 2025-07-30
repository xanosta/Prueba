import { DestroyRef, inject, Injectable } from '@angular/core';
import { ContainerSseFilters } from './types/containers-sse-filters';
import { Observable, of } from 'rxjs';
import { SseService } from '@shared/services/sse/sse.service';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { Container } from '../models/container.model';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';
import { environment } from '@enviroment/environment';
import { EventSource } from 'eventsource';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class ContainersSseService
  implements SseService<ContainerSseFilters, Container>
{
  private readonly endpoint: string =
    'operation/entries/container/subscription';
  private readonly destroyRef = inject(DestroyRef);

  public connect(
    filters: ContainerSseFilters
  ): Observable<SseEvent<Container>> {
    return new Observable<SseEvent<Container>>((observer) => {
      const { token, ...filtersValues } = filters;

      const parsedFilters = mapFiltersToHttpParams(filtersValues);
      const url = `${environment.API_URL}/${
        this.endpoint
      }?${parsedFilters.toString()}`;

      const eventSource = new EventSource(url, {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${token}`,
            },
          }),
      });

      eventSource.addEventListener('message', (event: MessageEvent<string>) => {
        observer.next(JSON.parse(event.data) as SseEvent<Container>);
      });

      eventSource.onerror = (err) => {
        observer.error(err);
      };

      return () => {
        eventSource.close();
      };
    }).pipe(takeUntilDestroyed(this.destroyRef));
  }
}
