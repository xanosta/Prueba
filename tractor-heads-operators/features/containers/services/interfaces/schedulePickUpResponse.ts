export interface SchedulePickUpResponse {
  scheduledDateTimeExit: string;
  scheduledDestination: ScheduledDestination;
  scheduledTractorHeadPlate: ScheduledTractorHeadPlate;
}

export interface ScheduledDestination {
  id: number;
  name: string;
}

export interface ScheduledTractorHeadPlate {
  id: number;
  vehiclePlate: string;
}
