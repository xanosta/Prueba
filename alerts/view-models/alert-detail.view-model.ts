import { AlertTypeCode } from '../models/alert-type';
import { PreviousInfo } from '../models/previous-info.type';
import { SeverityType } from '../models/severity';
import { UpdatedInfo } from '../models/updatedInfo';

export interface AlertDetailViewModel {
  id: number;
  type: AlertTypeCode;
  severity: SeverityType;
  createdDateTime?: string;
  vehicle: string;
  container: string;
  additionalInfo: string;
  previousInfo: PreviousInfo;
  updatedInfo: UpdatedInfo
}
