import { AlertType } from './alert-type';
import { PreviousInfo } from './previous-info.type';
import { SeverityType } from './severity';
import { UpdatedInfo } from './updatedInfo';

export interface Alert {
  alertId: number;
  alertType: AlertType;
  severity: SeverityType;
  residueEntryId: number;
  vehiclePlate: string;
  residueContainerId: number;
  containerCode: string;
  createdDateTime: string;
  additionalInfo: string;
  viewed: boolean;
  locationId: number;
  viewedUserId: string;
  previousInfo: PreviousInfo;
  updatedInfo: UpdatedInfo;
}
