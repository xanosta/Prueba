import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { Observable } from 'rxjs';
import { Truck } from '../models/truck';
import { GetTrucksFilters } from './types/getTrucksFilters';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

@Injectable({ providedIn: 'root' })
export class TrucksService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'operation/entries/vehicle';

  public getAllTrucks(filters: GetTrucksFilters): Observable<Array<Truck>> {
    const url = `${environment.API_URL}/${this.endpoint}`;
    const params = mapFiltersToHttpParams(filters);
    return this.http.get<Array<Truck>>(url, { params });
  }

  public updateTruck(
    residueEntryId: number,
    truckValues: Truck
  ): Observable<void> {
    const url = `${environment.API_URL}/operation/redisue-entry/${residueEntryId}`;

    // TODO: body
    return this.http.put<void>(url, {});
  }

  public deleteTruck(residueEntryId: number): Observable<void> {
    const url = `${environment.API_URL}/operation/redisue-entry/${residueEntryId}`;
    return this.http.delete<void>(url);
  }
}
