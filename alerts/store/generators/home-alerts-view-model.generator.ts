import { Alert } from '../../models/alert';
import { AlertViewModel } from '../../view-models/alert.view-model';
import { HomeAlertViewModel } from '../../view-models/home-alerts.view-model';

export function generateHomeAlertsViewModel(
  alerts: Array<Alert>
): HomeAlertViewModel {
  return {
    alerts: alerts.map((a) => fromModelToViewModel(a))
    .sort((a, b) => {
      const dateA = a.createdDateTime ? new Date(a.createdDateTime).getTime() : 0;
      const dateB = b.createdDateTime ? new Date(b.createdDateTime).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5),
  };
  function fromModelToViewModel(alert: Alert): AlertViewModel {
    return {
      id: alert.alertId,
      type: alert.alertType.alertTypeCode,
      severity: alert.severity,
      createdDateTime: alert.createdDateTime,
      hasBeenSeen: alert.viewed,
      vehicle: alert.vehiclePlate,
      container: alert.containerCode
    };
  }
}
