export enum TractorHeadOrderBy {
    ARRIVAL = 'arrivalDatetime',
    EXIT = 'exitDatetime'
}

export type OrderDirection = 'asc' | 'desc';

export interface TractorHeadOrder {
    by: TractorHeadOrderBy;
    direction: OrderDirection;
}

