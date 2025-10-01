import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DevicesResponse } from '../models/device.model';
import { FAKE_DEVICES_RESPONSE } from './devices.fake';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private readonly http = inject(HttpClient);

  /*
  getDevices(filters: any): Observable<DevicesResponse> {
    const url = `${environment.API_URL}/admin/devices`;
    const params = mapFiltersToHttpParams(filters);
    return this.http.get<DevicesResponse>(url, { params });
  }
  */

  //Endpoint fake
  getDevices(filters: any): Observable<DevicesResponse> {
    console.log('Filtros aplicados (fake service):', filters);
    return of(FAKE_DEVICES_RESPONSE).pipe(delay(500));
  }
}
