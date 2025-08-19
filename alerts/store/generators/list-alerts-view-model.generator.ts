import { Alert } from '../../models/alert';
import { AlertFilters } from '../../models/alert-filters';
import { AlertViewModel } from '../../view-models/alert.view-model';

export function listAlertsViewModelGenerator(
  alerts: Array<Alert>,
  filter: AlertFilters
): Array<AlertViewModel> {
  return alerts
    .filter((alert) => applyFilters(alert, filter))
    .map((alert) => fromAlertToAlertViewModel(alert))
    .sort((a, b) => {
      const dateA = a.createdDateTime ? new Date(a.createdDateTime).getTime() : 0;
      const dateB = b.createdDateTime ? new Date(b.createdDateTime).getTime() : 0;
      return dateB - dateA;
    });

  function applyFilters(alert: Alert, filters: AlertFilters): boolean {
    if (filters.alertType && filters.alertType.length > 0 && !filters.alertType.includes(alert.alertType.alertTypeCode))
      return false;
    if (filters.severity && filters.severity.length > 0 && !filters.severity.includes(alert.severity))
      return false;
    if (filters.vehicle && alert.vehiclePlate !== filters.vehicle)
      return false;
    if (filters.container && alert.containerCode !== filters.container)
      return false;
    if (filters.from && alert.createdDateTime && new Date(alert.createdDateTime) < filters.from)
      return false;
    if (filters.to && alert.createdDateTime && new Date(alert.createdDateTime) > filters.to)
      return false;

    return true;
  }

  function fromAlertToAlertViewModel(alert: Alert): AlertViewModel {
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
