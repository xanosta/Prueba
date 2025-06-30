import { ResidueType } from 'app/features/residue-types/models/residue-type';

export interface LocationViewModel {
  locationId: number;
  name: string;
  localEntityType: string;
  idCode: string;
  address: string;
  email: EmailViewModel[];
  phoneNumber: string;
  addUserId: string;
  deleteUserId: string;
  addDate: Date;
  deleteDate: Date;
  groupingType: GroupingTypeViewModel[];
  nima: number;
  internalCode: number;
  residueTypes: Array<ResidueType>;
}

export interface SmallLocationViewModel {
  locationId: number;
  name: string;
}

export interface EmailViewModel {
  emailAddressId: number;
  locationId: number;
  emailAddress: string;
  isMainContactAddress: boolean;
  sendResidueEntriesReport: string;
}

export interface GroupingTypeViewModel {
  clientGroupId: number;
  residueTypeId: number;
  collectionCompanyLocationId: number;
  clientLocationId: number;
}
