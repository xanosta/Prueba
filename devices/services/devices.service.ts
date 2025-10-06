import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { DevicesResponse, Zone } from '../models/device.model';
import { FAKE_DEVICES_RESPONSE } from './devices.fake';
import { EntryAreaPayload, WeighingPlatformPayload, HopperPayload } from '../models/add-zone.model';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private readonly http = inject(HttpClient);

  getDevices(filters: any): Observable<DevicesResponse> {
    console.log('Filtros aplicados (fake service):', filters);
    return of(FAKE_DEVICES_RESPONSE).pipe(delay(500));
  }

  addEntryArea(payload: EntryAreaPayload): Observable<Zone> {
    const url = `${environment.API_URL}/master/zones/entry-area`;
    console.log('Enviando a master/zones/entry-area:', payload);
    return this.http
      .post<Zone>(url, payload)
      .pipe(tap(response => console.log('Respuesta:', response)));
  }

  addWeighingPlatform(payload: WeighingPlatformPayload): Observable<Zone> {
    const url = `${environment.API_URL}/master/zones/weighting-platform`;
    console.log('Enviando a master/zones/weighting-platform:', payload);
    return this.http
      .post<Zone>(url, payload)
      .pipe(tap(response => console.log('Respuesta:', response)));
  }

  addHopper(payload: HopperPayload): Observable<Zone> {
    const url = `${environment.API_URL}/master/zones/hopper`;
    console.log('Enviando a master/zones/hopper:', payload);
    return this.http
      .post<Zone>(url, payload)
      .pipe(tap(response => console.log('Respuesta:', response)));
  }
}
