import { PartialStateUpdater } from '@ngrx/signals';
import { Alert } from '../../models/alert';
import { AlertsSlice } from '../alerts.slice';

export function setAlerts(
  alerts: Array<Alert>
): PartialStateUpdater<AlertsSlice> {
  return () => {
    const alertMap: Map<number, Alert> = new Map(
      alerts.map((alert) => [alert.alertId, alert])
    );

    return {
      _alerts: alertMap,
    };
  };
}
