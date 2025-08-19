import { AlertTypeCode } from '../models/alert-type';
import { SeverityType } from '../models/severity';

export interface AlertViewModel {
  id: number;
  type: AlertTypeCode;
  severity: SeverityType;
  createdDateTime?: string;
  hasBeenSeen: boolean;
  vehicle: string;
  container: string;
}
