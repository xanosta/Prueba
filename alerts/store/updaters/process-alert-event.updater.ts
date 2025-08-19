import { PartialStateUpdater } from '@ngrx/signals';
import { Alert } from '../../models/alert';
import { AlertsSlice } from '../alerts.slice';

export function processAlertEventUpdater(
  incomingAlert: Alert
): PartialStateUpdater<AlertsSlice> {
  return (state) => {
    const result = new Map(state._alerts);

    result.set(incomingAlert.alertId, incomingAlert);

    return {
      _alerts: result,
    };
  };
}
