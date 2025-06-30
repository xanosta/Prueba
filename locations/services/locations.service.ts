import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { Observable } from 'rxjs';

import { Location, SmallLocation } from '../models/location';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly http = inject(HttpClient);

  public getAllPTs(locationId: Array<number>): Observable<Array<Location>> {
    const url = `${environment.API_URL}/master/local-entity`;
    const params = mapFiltersToHttpParams({
      locationId,
      type: 'PR_TRANSF',
    });
    return this.http.get<Array<Location>>(url, { params });
  }

  public getAllOriginsFromDestiation(
    locationId: number
  ): Observable<Array<SmallLocation>> {
    const url = `${environment.API_URL}/master/info/residue-origins`;
    const params = mapFiltersToHttpParams({ locationId });

    return this.http.get<Array<SmallLocation>>(url, { params });
  }

  public getAll(): Observable<Array<Location>> {
    const url = `${environment.API_URL}/master/info/residue-origins`;

    return this.http.get<Array<Location>>(url);
  }
}
