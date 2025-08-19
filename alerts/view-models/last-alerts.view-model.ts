import { AlertViewModel } from './alert.view-model';

export interface LastAlertsViewModel {
  numberOfUnseenAlerts: number;
  lastAlerts: Array<AlertViewModel>;
}
