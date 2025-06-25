// View-models simples para las entidades anidadas, para ser usados en la vista.
interface LocationViewModel {
  id: number;
  name: string;
}

interface ContainerViewModel {
  id: number;
  code: string;
  residueTypes: Array<string>; // Se puede mantener como string para mostrarlo directamente.
  currentWeight: number;
}

// El view-model principal para la cabeza tractora.
// Esta interfaz será la que usará el `tractor-head-card.component` para pintar los datos.
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