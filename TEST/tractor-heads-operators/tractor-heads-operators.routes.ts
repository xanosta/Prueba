import { Routes } from '@angular/router';
import { TractorHeadsOperatorsLayoutComponent } from './layouts/tractor-heads-operators-layout/tractor-heads-operators-layout.component';
import { TractorHeadOperatorConfigStore } from './store/tractor-head-operator-config.store';
import { TractorHeadsService } from './features/tractor-heads/services/tractor-heads.service';
import { ContainersService } from './features/containers/services/containers.service';
import { MessageService } from 'primeng/api';

export const tractorHeadsOperatorsRoutes: Routes = [
  {
    path: '',
    component: TractorHeadsOperatorsLayoutComponent,
    providers: [
      TractorHeadOperatorConfigStore,
      TractorHeadsService,
      ContainersService,
      MessageService
    ],
    children: [
      {
        path: 'containers',
        loadComponent: () =>
          import(
            './features/containers/pages/containers/containers-page.component'
          ).then((c) => c.ContainersPageComponent),
      },
      {
        path: '**',
        redirectTo: 'containers',
      },
    ],
  },
];
