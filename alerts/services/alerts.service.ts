import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@enviroment/environment';
import { Alert } from '../models/alert';
import { mapFiltersToHttpParams } from '@shared/services/http/httpParamsMapper';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private readonly http = inject(HttpClient);
  private readonly apiEndpoint = 'operation/alert';

  public findAll(locationId: number): Observable<Array<Alert>> {
    const url = `${environment.API_URL}/${this.apiEndpoint}`;
    const params = mapFiltersToHttpParams({locationId})

    return this.http.get<Array<Alert>>(url, { params });
  }

  public alertViewed(alertId: number): Observable<Alert> {
    const url = `${environment.API_URL}/${this.apiEndpoint}/${alertId}`;
    const params = mapFiltersToHttpParams({
      viewed: true
    });

    return this.http.put<Alert>(url, null, { params });
  }
}
