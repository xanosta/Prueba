import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hopper } from '../models/hopper';
import { environment } from '@enviroment/environment';

@Injectable({ providedIn: 'root' })
export class HoppersService {
  private readonly http = inject(HttpClient);

  public getAllFromLocation(locationId: number): Observable<Array<Hopper>> {
    const url = `${environment.API_URL}/master/hopper`;
    const httpParams = new HttpParams().set('locationId', locationId);

    return this.http.get<Array<Hopper>>(url, { params: httpParams });
  }
}
