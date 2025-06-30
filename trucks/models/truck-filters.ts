import { ResidueType } from '../../../../../features/residue-types/models/residue-type';
import { TruckState } from './truck';

export interface TruckFilters {
  plate?: string;
  state?: Array<TruckState>;
  residueType?: ResidueType;
  originId?: Array<number>;
  from?: Date;
  to?: Date;
}
