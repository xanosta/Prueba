import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ContainersStore } from '../../store/containers.store';
import { WeightCardComponent } from '../../components/detail-cards/weight-card/weight-card.component';
import { InfoCardComponent } from '../../components/detail-cards/info-card/info-card.component';
import { DatesCardComponent } from '../../components/detail-cards/date-card/date-card.component';
import { StatesCardComponent } from '../../components/detail-cards/states-card/states-card.component';
import { OriginsCardComponent } from '../../components/detail-cards/origins-card/origins-card.component';
import { EmptyPageMessageComponent } from '../../../../../../shared/components/empty-page-message/empty-page-message.component';
import {
  ContainerLoadCard,
  UnloadWeightUpdate,
} from '../../components/load-card/load-card.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { PutContainerUnloadedWeight } from '../../services/types/put-container-unloaded-weight';
import { MessageService } from 'primeng/api';
@Component({
  templateUrl: './container-detail-page.component.html',
  imports: [
    PlantOperatorBreadCrumbsComponent,
    CardComponent,
    DatesCardComponent,
    TranslatePipe,
    WeightCardComponent,
    InfoCardComponent,
    StatesCardComponent,
    OriginsCardComponent,
    EmptyPageMessageComponent,
    ContainerLoadCard,
    HeaderComponent
  ],
})
export class ContainerDetailPageComponent {
  public containerId = input.required({ transform: numberAttribute });

  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  public breadcrumbs = computed(() => [
    { label: 'containers', link: '/planta/containers' },
    {
      label: `${this.containerId()}`,
      link: `/planta/containers/${this.containerId}`,
    },
  ]);

  public readonly containerStore = inject(ContainersStore);
  private weightChanges = new Map<number, number>();

  @ViewChildren(ContainerLoadCard) private loadCards!: QueryList<ContainerLoadCard>;

  constructor() {
    this.containerStore.setSelectedContainer(this.containerId);
  }

  public unloadWeightChangeHandler($event: UnloadWeightUpdate) {
    this.weightChanges.set($event.id, $event.newValue);
  }
  public saveChanges(): void {
    const container = this.containerStore.selectedContainer();
    if (!container) {
      return;
    }

    if (this.weightChanges.size === 0) {
      return;
    }

    const hasInvalidWeight = this.loadCards.toArray().some(card => card.loadWeightIsInvalid);

    if (hasInvalidWeight) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('container.messages.update.invalidUpdateValues.title'),
        detail: this.translateService.instant('container.messages.update.invalidUpdateValues.description'),
      });
      return;
    }

    this.weightChanges.forEach((weight, entryId) => {
      const payload: PutContainerUnloadedWeight = {
        residueContainerId: container.residueContainerId,
        residueEntryId: entryId,
        residueEntryWeightInContainer: weight,
        modifyDateTime: new Date().toISOString(),
      };
      this.containerStore.updateUnloadedWeight({ payload, containerId: container.id });
    });

    this.weightChanges.clear();
  }

  public discardChanges(): void {
    this.weightChanges.clear();
    this.loadCards.forEach(card => {

      const originalWeight = card.load().unloadWeight;
      card.resetUnloadWeight(originalWeight);
    });
  }
}