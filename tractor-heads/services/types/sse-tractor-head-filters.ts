import { TractorHeadFilters } from "../../models/tractor-head-filters";

type RequiredFilters = {
    locationId: number;
    token: string;
};

export type SseTractorHeadFilters = RequiredFilters & Partial<TractorHeadFilters>;