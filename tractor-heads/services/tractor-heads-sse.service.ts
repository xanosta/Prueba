// import { DestroyRef, inject, Injectable } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { Observable } from 'rxjs';
// import { EventSource } from 'eventsource';

// import { environment } from '@enviroment/environment';
// import { ConfigStore } from '@config/store/app-config.store';
// import { AuthStore } from '@auth/store/auth.store';
// import { SseEvent } from '@shared/services/sse/sseEvent';
// import { SseService } from '@shared/services/sse/sse.service';
// import { TractorHead } from '../models/tractor-head';
// import { TractorHeadFilters } from '../models/tractor-head-filters';
// import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

// @Injectable()
// export class TractorHeadsSseService implements SseService<TractorHeadFilters, TractorHead> {
//   // El endpoint para las cabezas tractoras.
//   // Asumo una ruta similar a la de trucks, terminada en /subscription.
//   private readonly sseEndpoint: string = 'operation/entries/tractor-head';

//   private readonly destroyRef = inject(DestroyRef);
//   //TODO configstore
//   private readonly configStore = inject(ConfigStore);
//   private readonly authStore = inject(AuthStore);

//   /**
//    * Se conecta al endpoint SSE para recibir actualizaciones de cabezas tractoras.
//    * @param filters - Los filtros a aplicar en la consulta.
//    * @returns Un Observable que emite eventos del tipo SseEvent<TractorHead>.
//    */
//   public connect(filters: TractorHeadFilters): Observable<SseEvent<TractorHead>> {
//     return new Observable<SseEvent<TractorHead>>((observer) => {
//       // Usamos el helper de Angular para construir los parámetros de la URL.
//       const params = mapFiltersToHttpParams(filters);

//       const eventsource = new EventSource(
//         //`${environment.API_URL}/${this.sseEndpoint}?${params.toString()}`,
//         `${environment.API_URL}/${this.sseEndpoint}?locationId=2`,
//         {
//           // Al igual que en TrucksSseService, añadimos el token de autorización.
//           fetch: (input, init) =>
//             fetch(input, {
//               ...init,
//               headers: {
//                 ...init.headers,
//                 Authorization: `Bearer ${this.authStore.token()}`,
//               },
//             }),
//         }
//       );

//       // Escuchamos el evento 'message' que trae los datos.
//       eventsource.addEventListener('message', (event: MessageEvent<string>) => {
//         console.log('[DEBUG 1] Evento SSE crudo recibido:', event.data);
//         observer.next(JSON.parse(event.data) as SseEvent<TractorHead>);
//       });

//       // Manejamos los errores de la conexión.
//       eventsource.onerror = (err) => {
//         observer.error(err);
//       };

//       // Al desuscribirse, cerramos la conexión SSE.
//       return () => {
//         eventsource.close();
//       };
//     }).pipe(takeUntilDestroyed(this.destroyRef)); // El observable se completa automáticamente al destruir el componente.
//   }
// }

import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EventSource } from 'eventsource';

import { environment } from '@enviroment/environment';
import { ConfigStore } from '@config/store/app-config.store';
import { AuthStore } from '@auth/store/auth.store';
// ¡Importante! Asegúrate de que estos dos imports están presentes
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

      const eventsource = new EventSource(
        `${environment.API_URL}/${this.sseEndpoint}?locationId=2`,
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
        // Si el mensaje está vacío o no es un JSON, lo ignoramos.
        if (!event.data || !event.data.startsWith('{')) {
          return;
        }

        try {
          const tractorHeadData = JSON.parse(event.data) as TractorHead;

          // Creamos un objeto "SseEvent" falso para que el resto del código funcione.
          const fakeSseEvent: SseEvent<TractorHead> = {
            action: EventTypes.CREATION, // o LOAD, da igual para el parche
            data: tractorHeadData,
          };

          observer.next(fakeSseEvent);

        } catch (e) {
          console.error('[SSE Patch] Se ignoró un mensaje JSON malformado. Datos:', event.data, 'Error:', e);
          // No hacemos nada con el error para mantener la conexión viva.
        }
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