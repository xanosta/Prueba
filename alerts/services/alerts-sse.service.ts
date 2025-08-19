import { Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { EventSource } from 'eventsource';

const API_ENDPOINT = 'operation/alert/subscription';

@Injectable()
export class AlertsSSEService {
  private eventSource: EventSource | null = null;

  public connect(token: string, selectedLocationId: number): EventSource {
    if (this.eventSource) {
      this.disconnect();
    }

    const url = `${environment.API_URL}/${API_ENDPOINT}?locationId=${selectedLocationId}`;

    const source = new EventSource(url, {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
          },
        }),
    });

    return source;
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
