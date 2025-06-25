import { TractorHeadFilters } from '../../models/tractor-head-filters';

// Define los filtros requeridos y opcionales para la petición al endpoint.
// Similar a GetTrucksFilters.
type RequiredFilters = {
  locationId: number;
};

// Partial<TractorHeadFilters> hace que todas las propiedades de la interfaz sean opcionales.
export type GetTractorHeadsFilters = RequiredFilters &
  Partial<TractorHeadFilters>;

/**
 * Mapea los filtros de la UI a un objeto de filtros para el servicio.
 * @param filters - El objeto de filtros desde el store/UI.
 * @param locationId - El ID de la ubicación actual, obtenido del ConfigStore.
 * @returns Un objeto de filtros listo para ser usado en la construcción de la URL.
 */
export function mapToGetTractorHeadFilters(
  filters: TractorHeadFilters,
  locationId: number
): GetTractorHeadsFilters {
  const mapped: GetTractorHeadsFilters = {
    locationId,
  };

  // Copiamos las propiedades de los filtros si tienen valor.
  // Este enfoque es simple y evita enviar parámetros de consulta vacíos.
  if (filters.tractorHeadPlate) {
    mapped.tractorHeadPlate = filters.tractorHeadPlate;
  }
  if (filters.originId) {
    mapped.originId = filters.originId;
  }
  if (filters.destinationId) {
    mapped.destinationId = filters.destinationId;
  }
  if (filters.tractorHeadStatus) {
    mapped.tractorHeadStatus = filters.tractorHeadStatus;
  }
  if (filters.ArrivalResidueTypes?.length) {
    mapped.ArrivalResidueTypes = filters.ArrivalResidueTypes;
  }
  if (filters.ExitResidueTypes?.length) {
    mapped.ExitResidueTypes = filters.ExitResidueTypes;
  }
  if (filters.from instanceof Date && !isNaN(filters.from.getTime())) {
    mapped.from = filters.from;
  }
  if (filters.to instanceof Date && !isNaN(filters.to.getTime())) {
    mapped.to = filters.to;
  }


  return mapped;
}