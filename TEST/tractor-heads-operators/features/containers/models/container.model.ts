import { Location } from '@features/locations/models/location';
import { ContainerType } from './container-type.model';
import { ResidueType } from '@features/residue-types/models/residue-type';
import { TractorHead } from '../../tractor-heads/models/tractor-head.model';
import { ContainerStatus } from './container-status.model';

export interface Container {
  code: string;
  containerStayId: number;
  containerType: ContainerType;
  residueTypes: Array<ResidueType>;
  currentState: ContainerStatus;
  currentLocation: Location;
  originLocation: Location;
  destinationLocation: Location;
  scheduledPickup: ScheduledPickup;
  notifiedDateTimeExit: string;
  notifiedDestination: Location;
  notifiedTractorHeadPlate: TractorHead;
  pickupOrder: number;
  capacity: number;
  currentWeight: number;
  arrivalDateTime: Date;
  fullLoadDateTime: Date;
}

export interface ScheduledPickup {
  scheduledDateTimeExit: string;
  scheduledDestination: Location;
  scheduledTractorHeadPlate: TractorHead;
}
