import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContainerDetail } from '../models/container-detail.model';
import { Observable } from 'rxjs';
import { environment } from '@enviroment/environment';
import { PutContainerUnloadedWeight } from './types/put-container-unloaded-weight';

const API_ENDPOINT = 'operation/entries/container';
const API_UNLOADED_ENDPOINT = 'operation/container/unloaded-weight';

@Injectable()
export class ContainersService {
  private readonly http = inject(HttpClient);

  public getContainerById(containerId: number): Observable<ContainerDetail> {
    const url = `${environment.API_URL}/${API_ENDPOINT}/${containerId}`;
    const params = new HttpParams()
      .set('orderBy', 'TIME_BEGIN')
      .set('orderType', 'DESC');

    return this.http.get<ContainerDetail>(url, { params });
  }

  public updateUnloadedWeight(
    payload: PutContainerUnloadedWeight
  ): Observable<void> {
    const url = `${environment.API_URL}/${API_UNLOADED_ENDPOINT}`;
    return this.http.put<void>(url, payload);
  }
}
