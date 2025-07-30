import { ResidueType } from '@features/residue-types/models/residue-type';

type OptionalFilters = {
  code: string;
  shippingState: string;
  containerType: string;
  residueType: ResidueType;
  locationId: number;
};

type MandatoryFilters = {
  currentPage: number;
};

export type ContainersFilters = MandatoryFilters & Partial<OptionalFilters>;
