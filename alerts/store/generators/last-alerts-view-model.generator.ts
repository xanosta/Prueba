import { Alert } from '../../models/alert';
import { AlertViewModel } from '../../view-models/alert.view-model';
import { LastAlertsViewModel } from '../../view-models/last-alerts.view-model';

export function generateLastAlertsViewModel(
  alerts: Array<Alert>
): LastAlertsViewModel {
  return {
    numberOfUnseenAlerts: alerts.filter((alert) => !alert.viewed).length,
    lastAlerts: alerts.map((a) => fromModelToViewModel(a)),
  };

  function fromModelToViewModel(alert: Alert): AlertViewModel {
    return {
      id: alert.alertId,
      type: alert.alertType.alertTypeCode,
      severity: alert.severity,
      hasBeenSeen: alert.viewed,
      vehicle: alert.vehiclePlate,
      container: alert.containerCode
    };
  }
}
