import { ResidueType } from "app/features/residue-types/models/residue-type";

export type SmallLocation = Pick<Location, 'locationId' | 'name'>

export type Location = {
  locationId:      number;
  name:            string;
  localEntityType: string;
  idCode:          string;
  address:         string;
  email:           Email[];
  phoneNumber:     string;
  addUserId:       string;
  deleteUserId:    string;
  addDate:         Date;
  deleteDate:      Date;
  groupingType:    GroupingType[];
  nima:            number;
  internalCode:    number;
  residueTypes:    Array<ResidueType>;
}

export interface Email {
  emailAddressId:           number;
  locationId:               number;
  emailAddress:             string;
  isMainContactAddress:     boolean;
  sendResidueEntriesReport: string;
}

export interface GroupingType {
  clientGroupId:               number;
  residueTypeId:               number;
  collectionCompanyLocationId: number;
  clientLocationId:            number;
}
