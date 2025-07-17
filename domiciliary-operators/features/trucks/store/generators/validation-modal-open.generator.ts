export function validationModalOpenGenerator(selectedTruckId?: number): boolean {
    if (!selectedTruckId || selectedTruckId === -1) return false;

    return true;
}