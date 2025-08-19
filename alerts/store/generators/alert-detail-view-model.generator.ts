import { Alert } from '../../models/alert';
import { AlertDetailViewModel } from '../../view-models/alert-detail.view-model';

export function generateAlertDetailViewModel(
  alerts: Array<Alert>,
  alertId: number | null
): AlertDetailViewModel | null {
  if(!alertId) return null;
  
  const alert = alerts.find(a => a.alertId === alertId);

  if (!alert) return null;

  return fromModelToViewModel(alert);
}

function fromModelToViewModel(alert: Alert): AlertDetailViewModel {
  return {
    id: alert.alertId,
    type: alert.alertType.alertTypeCode,
    severity: alert.severity,
    createdDateTime: alert.createdDateTime,
    vehicle: alert.vehiclePlate || '-',
    container: alert.containerCode || '-',
    additionalInfo: alert.additionalInfo || '-',
    previousInfo: alert.previousInfo,
    updatedInfo: alert.updatedInfo
  };
}
