import { TractorHead } from '../../models/tractor-head';
import { TractorHeadFilters } from '../../models/tractor-head-filters';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';

/**
 * Transforma el array de modelos de TractorHead en un array de ViewModels para la UI.
 * A diferencia del generator de trucks, este no aplica filtros del lado del cliente,
 * ya que se asume que el filtrado se realiza en el backend a través del SSE.
 *
 */
export function tractorHeadsListGenerator(
  tractorHeads: Array<TractorHead>,
  //filters: TractorHeadFilters
): Array<TractorHeadViewModel> {
  return tractorHeads
    //.filter((tractorHead) => applyFilters(tractorHead, filters))
    .map((tractorHead) => fromModelToViewModel(tractorHead));
}

// function applyFilters(tractorHead: TractorHead, filters: TractorHeadFilters): boolean {
//   // 1. Filtro por matrícula
//   if (
//     filters.tractorHeadPlate &&
//     !tractorHead.tractorHeadPlate.toLowerCase().includes(filters.tractorHeadPlate.toLowerCase())
//   ) {
//     return false;
//   }

//   // 2. Filtro por ID de destino
//   // Accedemos a la propiedad anidada `tractorHead.destination.id`
//   if (
//     filters.destinationId != null &&
//     tractorHead.destination?.id !== filters.destinationId
//   ) {
//     return false;
//   }

//   // 3. Filtro por estado de la cabeza tractora
//   if (
//     filters.tractorHeadStatus &&
//     tractorHead.tractorHeadStatus !== filters.tractorHeadStatus
//   ) {
//     return false;
//   }

//   // 4. Filtro por tipos de residuo a la llegada
//   // Lógica actualizada: Comprueba si ALGUNO de los tipos de residuo del contenedor
//   // de llegada está presente en la lista de tipos de residuo del filtro.
//   if (
//     Array.isArray(filters.ArrivalResidueTypes) &&
//     filters.ArrivalResidueTypes.length > 0
//   ) {
//     // Si el contenedor o la lista de residuos no existen, no puede haber coincidencia.
//     if (!tractorHead.arrivalContainer?.residueTypes) {
//       return false;
//     }
//     // `some` devuelve true si encuentra al menos una coincidencia.
//     const hasMatchingResidue = tractorHead.arrivalContainer.residueTypes.some(
//       (tractorResidue) => filters.ArrivalResidueTypes?.includes(tractorResidue)
//     );
//     if (!hasMatchingResidue) {
//       return false;
//     }
//   }

//   // 5. Filtro por tipos de residuo a la salida (misma lógica que a la llegada)
//   if (
//     Array.isArray(filters.ExitResidueTypes) &&
//     filters.ExitResidueTypes.length > 0
//   ) {
//     if (!tractorHead.exitContainer?.residueTypes) {
//       return false;
//     }
//     const hasMatchingResidue = tractorHead.exitContainer.residueTypes.some(
//       (tractorResidue) => filters.ExitResidueTypes?.includes(tractorResidue)
//     );
//     if (!hasMatchingResidue) {
//       return false;
//     }
//   }

//   // 6. Filtro por rango de fechas, usando 'arrivalDatetime'
//   // El modelo indica que la fecha puede ser un string o null.
//   const itemDateStr = tractorHead.arrivalDatetime;
//   if (filters.from || filters.to) {
//     if (!itemDateStr) {
//       return false; // Si no hay fecha, no puede cumplir el filtro.
//     }
//     const itemDate = new Date(itemDateStr).getTime();

//     if (filters.from && itemDate < new Date(filters.from).getTime()) {
//       return false;
//     }

//     if (filters.to) {
//       const toDate = new Date(filters.to);
//       toDate.setHours(23, 59, 59, 999);
//       if (itemDate > toDate.getTime()) {
//         return false;
//       }
//     }
//   }


//   // ¡Pasó todas las validaciones! Se queda.
//   return true;
// }

function fromModelToViewModel(
  tractorHead: TractorHead
): TractorHeadViewModel {
  return {
    plate: tractorHead.tractorHeadPlate,
    status: tractorHead.tractorHeadStatus,
    model: tractorHead.model,
    brand: tractorHead.brand,
    arrivalDatetime: tractorHead.arrivalDatetime,
    exitDatetime: tractorHead.exitDatetime,
    origin: {
      id: tractorHead.origin.id,
      name: tractorHead.origin.name,
    },
    destination: {
      id: tractorHead.destination.id,
      name: tractorHead.destination.name,
    },
    arrivalContainer: {
      id: tractorHead.arrivalContainer.id,
      code: tractorHead.arrivalContainer.code,
      residueTypes: tractorHead.arrivalContainer.residueTypes,
      currentWeight: tractorHead.arrivalContainer.currentWeight,
    },
    exitContainer: {
      id: tractorHead.exitContainer.id,
      code: tractorHead.exitContainer.code,
      residueTypes: tractorHead.exitContainer.residueTypes,
      currentWeight: tractorHead.exitContainer.currentWeight,
    },
  };
}