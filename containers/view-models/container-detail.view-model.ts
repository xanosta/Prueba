import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { ContainerState } from '../models/container-state.model';
import { ContainerLoadViewModel } from './container-load.view-model';

export interface ContainerDetailViewModel {
  id: number;
  residueContainerId: number;
  code: string;
  lastLoadHopper?: string;
  currentWeight: number;
  entry: Date;
  exit?: Date;
  state: ContainerState;
  residueTypes: Array<ResidueType>;
  origins: Array<string>;
  loads: Array<ContainerLoadViewModel>;
}
