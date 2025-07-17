import { Routes } from '@angular/router';
import { DomiciliaryOperatorsLayoutComponent } from './layouts/domiciliary-operators-layout.component';
import { ListDomiciliaryTrucksPageComponent } from './features/trucks/pages/list-domiciliary-trucks-page/list-domiciliary-trucks-page';

import { TrucksService } from '../plant-operators/features/trucks/services/trucks.service';
import { TrucksSseService } from '../plant-operators/features/trucks/services/trucks-sse.service';
import { DomiciliaryTrucksStore } from './features/trucks/store/domiciliary-trucks.store';

export const domiciliaryOperatorsRoutes: Routes = [
    {
        path: '',
        component: DomiciliaryOperatorsLayoutComponent,
        providers: [
            TrucksService,
        ],
        children: [
            {
                path: 'trucks',
                providers: [DomiciliaryTrucksStore, TrucksSseService],
                loadComponent: () =>
                    import(
                        './features/trucks/pages/list-domiciliary-trucks-page/list-domiciliary-trucks-page'
                    ).then((c) => c.ListDomiciliaryTrucksPageComponent),
            },
            {
                path: '**',
                redirectTo: 'trucks',
            },
        ],
    },
];