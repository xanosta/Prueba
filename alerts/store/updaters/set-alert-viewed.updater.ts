import { PartialStateUpdater } from '@ngrx/signals';
import { AlertsSlice } from '../alerts.slice';
import { Alert } from '../../models/alert';

export function setAlertViewedUpdater(
  alertId: number
): PartialStateUpdater<AlertsSlice> {
  return (state) => {
    const alertMap: Map<number, Alert> = new Map(state._alerts);
    const alert = alertMap.get(alertId);

    if (alert) {
      alertMap.set(alertId, { ...alert, viewed: true });
    }

    return {
      _alerts: alertMap,
    };
  };
}
