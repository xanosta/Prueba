export interface HopperEventViewModel {
  containerCompact: ContainerCompact;
  truckUnloads: TruckUnload[];
  containerLoads: ContainerLoad[];
}

export interface ContainerCompact {
  id: number;
  containerStayId: number;
  code: string;
  state: string;
  residueTypes: string[];
  capacity: number;
  currentWeight: number;
  startUnloadDatetime: string;
  endUnloadDatetime: string;
}

export interface ContainerLoad {
  id: number;
  truckId: number;
  truckPlate: string;
  residueTypes: string[];
  unloadDatetime: Date;
  unloadHopper: UnloadHopper;
  unloadPercentage: number;
  truckResidueWeight: number;
  unloadWeight: number;
}

export interface UnloadHopper {
  id: number;
  name: string;
}

export interface TruckUnload {
  id: number;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleBrand: string;
  origins: UnloadHopper[];
  residueTypes: string[];
  vehicleWeight: number;
  arrivalWeight: number;
  exitWeight: number;
  unloadWeight: number;
  unloadPercentage: number;
  startUnloadDatetime: string;
  endUnloadDatetime: string;
  currentState: string;
}
