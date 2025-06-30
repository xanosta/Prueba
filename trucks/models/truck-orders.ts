import { Order } from '../../../../../shared/models/order';

export enum TruckOrderBy {
  arrival = 'datetimeArrival',
  exit = 'datetimeExit',
}

export type TruckOrder = Order<TruckOrderBy>;
