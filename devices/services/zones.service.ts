import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface CreateZonePayload {
  zoneType: string;
  locationId: number;
  name: string;
}

export interface CreateZoneResponse {
  id: number;
  zoneType: string;
  name: string;
  locationId: number;
}

@Injectable({ providedIn: 'root' })
export class ZonesService {
  private readonly http = inject(HttpClient);

  /*
  createZone(payload: CreateZonePayload): Observable<HttpResponse<CreateZoneResponse>> {
    const url = `${environment.API_URL}/admin/locations/${payload.locationId}/zones`;
    return this.http.post<CreateZoneResponse>(url, payload, { observe: 'response' });
  }
  */

  // Endpoint fake
  createZone(payload: CreateZonePayload): Observable<HttpResponse<CreateZoneResponse>> {
    console.log('ZonesService.createZone payload (fake service):', payload);

    const mockResponse: CreateZoneResponse = {
      id: Math.floor(Math.random() * 10000) + 100,
      zoneType: payload.zoneType,
      name: payload.name,
      locationId: payload.locationId,
    };

    return of({
      status: 201,
      body: mockResponse,
    } as HttpResponse<CreateZoneResponse>).pipe(delay(500));
  }
}
