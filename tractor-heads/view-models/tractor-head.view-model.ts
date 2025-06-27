interface LocationViewModel {
  id: number;
  name: string;
}

interface ContainerViewModel {
  id: number;
  code: string;
  residueTypes: Array<string>;
  currentWeight: number;
}


export interface TractorHeadViewModel {
  plate: string;
  status: string;
  model: string;
  brand: string;
  arrivalDatetime: string | null;
  exitDatetime: string | null;
  origin: LocationViewModel;
  destination: LocationViewModel;
  arrivalContainer: ContainerViewModel;
  exitContainer: ContainerViewModel;
}