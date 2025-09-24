import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DevicesResponse } from '../models/device.model';
import { FAKE_DEVICES_RESPONSE } from './devices.fake';
import {
  FAKE_DEVICE_DETAIL_RESPONSE,
  FAKE_HOPPER,
  FAKE_ENTRY_AREA,
  FAKE_WEIGHING_PLATFORM,
} from './devices.fake';

import { Device, Hopper, EntryArea, WeighingPlatform } from '../models/device.model';

export interface PositionDTO {
  id: number;
  plantPosition: string;
  deviceTypeInPlant: string;
}

export interface DeviceUpdateRequest {
  deviceId: number;
  name: string;
  type: string;
  locationId: number;
  ip: string;
  port: string;
  power: number;
  frequency: number;
  PositionDTO: PositionDTO;
}

export interface DeviceCreateRequest {
  name: string;
  type: string;
  locationId: number;
  ip: string;
  port: string;
  power: number;
  frequency: number;
  positionDTO: PositionDTO;
}

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private readonly http = inject(HttpClient);

  getDevices(filters: any): Observable<DevicesResponse> {
    // const url = `${environment.API_URL}/admin/devices`;
    // const params = mapFiltersToHttpParams(filters);
    // return this.http.get<DevicesResponse>(url, { params });
    console.log('Filtros aplicados (fake service):', filters);
    return of(FAKE_DEVICES_RESPONSE).pipe(delay(500));
  }

  getDeviceById(id: number): Observable<Device> {
    // const url = `${environment.API_URL}/master/device/${id}`;
    // return this.http.get<Device>(url);
    console.log(`Pidiendo detalle para el device con ID: ${id} (fake service)`);
    return of(FAKE_DEVICE_DETAIL_RESPONSE).pipe(delay(500));
  }

  updateDevice(id: number, deviceData: DeviceUpdateRequest): Observable<any> {
    // const url = `${environment.API_URL}/master/device/${id}`;
    // return this.http.put(url, deviceData);
    console.log(`Actualizando device con ID: ${id} (fake service)`, deviceData);
    return of({}).pipe(delay(500));
  }

  createDevice(deviceData: DeviceCreateRequest): Observable<any> {
    // const url = `${environment.API_URL}/master/device`;
    // return this.http.post(url, deviceData);
    console.log('Creando nuevo device (fake service)', deviceData);
    return of({}).pipe(delay(500));
  }

  // --- HOPPER ---
  getHopperById(id: number): Observable<Hopper> {
    // const url = `${environment.API_URL}/master/hopper/${id}`;
    // return this.http.get<Hopper>(url);
    console.log(`Pidiendo detalle para el hopper con ID: ${id} (fake service)`);
    return of(FAKE_HOPPER).pipe(delay(500));
  }

  updateHopper(id: number, data: any): Observable<any> {
    // const url = `${environment.API_URL}/master/hopper/${id}`;
    // return this.http.put(url, data);
    console.log(`Actualizando hopper con ID: ${id} (fake service)`, data);
    return of({}).pipe(delay(500));
  }

  // --- ENTRY AREA ---
  getEntryAreaById(id: number): Observable<EntryArea> {
    // const url = `${environment.API_URL}/master/entry_area/${id}`;
    // return this.http.get<EntryArea>(url);
    console.log(`Pidiendo detalle para el entry area con ID: ${id} (fake service)`);
    return of(FAKE_ENTRY_AREA).pipe(delay(500));
  }

  updateEntryArea(id: number, data: any): Observable<any> {
    // const url = `${environment.API_URL}/master/entry_area/${id}`;
    // return this.http.put(url, data);
    console.log(`Actualizando entry area con ID: ${id} (fake service)`, data);
    return of({}).pipe(delay(500));
  }

  // --- WEIGHING PLATFORM ---
  getWeighingPlatformById(id: number): Observable<WeighingPlatform> {
    // const url = `${environment.API_URL}/master/weighting-platform/${id}`;
    // return this.http.get<WeighingPlatform>(url);
    console.log(`Pidiendo detalle para la weighing platform con ID: ${id} (fake service)`);
    return of(FAKE_WEIGHING_PLATFORM).pipe(delay(500));
  }

  updateWeighingPlatform(id: number, data: any): Observable<any> {
    // const url = `${environment.API_URL}/master/weighting-platform/${id}`;
    // return this.http.put(url, data);
    console.log(`Actualizando weighing platform con ID: ${id} (fake service)`, data);
    return of({}).pipe(delay(500));
  }
}
