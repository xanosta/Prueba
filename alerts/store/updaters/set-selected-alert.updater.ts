import { PartialStateUpdater } from "@ngrx/signals";
import { AlertsSlice } from "../alerts.slice";

export function setSelectedAlertUpdater(
  alertId: number | null
): PartialStateUpdater<AlertsSlice> {
  return (_) => {
    if(!alertId) return {};
    return {
      _selectedAlertId: alertId
    }
  }
}
