import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { ContainerState } from '../models/container-state.model';

export interface ContainerViewModel {
  id: number;
  code: string;
  residueTypes: Array<ResidueType>;
  state: ContainerState;
  exit?: Date;
  entry: Date;
  currentWeight: number;
  maxCapacity: number;
  trucks: Array<string>;
  origins: Array<string>;
  needToBeRemovedFromLocation: boolean;
}
