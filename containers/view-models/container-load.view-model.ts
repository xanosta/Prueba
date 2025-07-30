export interface ContainerLoadViewModel {
  id: number;
  truckId: number;
  truckPlate: string;
  residueTypes: string[];
  unloadDatetime: Date;
  unloadHopper: Hopper;
  unloadPercentage: number;
  truckResidueWeight: number;
  unloadWeight: number;
  changeInContainer: boolean;
}

export interface Hopper {
  id: number;
  name: string;
}
