import { SmallLocationViewModel } from '@features/locations/view-model/location.view-model';
import { ResidueType } from '@features/residue-types/models/residue-type';

export interface ContainerPickUpViewModel {
  id: number;
  code: string;
  containerType: string;
  state: string;
  residueTypes: ResidueType[];
  scheduledPickup?: PickUpAssignment;
  pickUpAsignee?: PickUpAssignment;
  isAlreadyPicked: boolean;
  isBooked: boolean;
  capacity: number;
  currentWeight: number;
  arrivalDateTime: Date;
  fullLoadDateTime: Date;
}

interface PickUpAssignment {
  tractorHeadPlate: string;
  destination: SmallLocationViewModel;
  date: Date;
}
