import { SeverityType } from '../models/severity';

type ToastType = 'info' | 'warn' | 'error' | 'success';

export function mapAlertSeverityToToast(severity: SeverityType): ToastType {
  switch (severity) {
    case SeverityType.INFO:
      return 'info';
    case SeverityType.DANGER:
      return 'error';
    case SeverityType.WARNING:
      return 'warn';
    default:
      throw new Error('Severity type not mapped to toast');
  }
}
