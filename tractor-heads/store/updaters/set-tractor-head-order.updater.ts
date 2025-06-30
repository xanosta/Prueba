import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';
import { TractorHeadOrder } from '../../models/tractor-head-orders';

export function setTractorHeadOrderUpdater(
    order: TractorHeadOrder
): PartialStateUpdater<TractorHeadsSlice> {
    return () => ({
        order: order,
    });
}