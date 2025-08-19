import { AlertTypeCode } from "./alert-type";
import { SeverityType } from "./severity";

export interface AlertFilters {
  alertType?: Array<AlertTypeCode>;
  severity?: Array<SeverityType>;
  vehicle?: string;
  container?: string;
  from?: Date;
  to?: Date;
}
