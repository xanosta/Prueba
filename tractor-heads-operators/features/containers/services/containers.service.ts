import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Container } from '../models/container.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@enviroment/environment';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';
import { ContainerType } from '../models/container-type.model';
import { PaginatedResponse } from '@shared/services/http/types/paginatedResponse';
import { SchedulePickUpBody } from './interfaces/schedulePickUpBody';
import { GetSuggestedLocations } from './interfaces/getSuggestedLocations';
import { ResidueType } from '@features/residue-types/models/residue-type';
import { GetContainersWaitingForPickUpFilters } from './interfaces/getContainersWaitingForPickupFilters';
import { SchedulePickUpResponse } from './interfaces/schedulePickUpResponse';

@Injectable()
export class ContainersService {
  private readonly http = inject(HttpClient);

  getContainersWaitingForPickup(
    filters: GetContainersWaitingForPickUpFilters
  ): Observable<PaginatedResponse<Container>> {
    const url = `${environment.API_URL}/operation/transporter/container`;
    const params = mapFiltersToHttpParams(filters);
    return this.http.get<PaginatedResponse<Container>>(url, { params });
  }

  getContainersTypes(): Observable<Array<ContainerType>> {
    const url = `${environment.API_URL}/master/info/container-types`;
    return this.http.get<Array<ContainerType>>(url);
  }

  getSuggestedLocations(filters: {
    originId: number;
    residueType: Array<ResidueType>;
  }): Observable<GetSuggestedLocations> {
    const url = `${environment.API_URL}/master/info/default-residue-destinations`;
    const params = mapFiltersToHttpParams(filters);

    return this.http.get<GetSuggestedLocations>(url, { params });
  }

  schedulePickUp(
    containerStayId: number,
    body: SchedulePickUpBody
  ): Observable<SchedulePickUpResponse & { containerStayId: number }> {
    const url = `${environment.API_URL}/operation/scheduled-pickup/${containerStayId}`;

    return this.http
      .post<SchedulePickUpResponse>(url, body)
      .pipe(map((resp) => ({ ...resp, containerStayId })));
  }
}
