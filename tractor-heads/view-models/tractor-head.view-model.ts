interface LocationViewModel {
  id: number | null;
  name: string | null;
}

interface ContainerViewModel {
  id: number | null;
  code: string | null;
  residueTypes: Array<string> | null;
  currentWeight: number | null;
}


export interface TractorHeadViewModel {
  id: number;
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