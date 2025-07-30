import { Observable } from 'rxjs';
import { TractorHead } from '../models/tractor-head.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@enviroment/environment';

@Injectable()
export class TractorHeadsService {
  private readonly http = inject(HttpClient);

  public getAll(): Observable<Array<TractorHead>> {
    const url = `${environment.API_URL}/master/vehicle-master`;
    const params = new HttpParams().set('type', 'TRACTORA');

    return this.http.get<Array<TractorHead>>(url, { params });
  }
}
