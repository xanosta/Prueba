import { Component, inject, input, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

import { NewTruckComponent } from '../forms/new-truck/new-truck.component';
import { SmallLocationViewModel } from 'app/features/locations/view-model/location.view-model';
import { HopperViewModel } from '../../../hoppers/view-models/hopper.view-model';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { TruckViewModel } from '../../view-models/truck.view-model';
import { IconComponent } from '@shared/components/icon/icon.component';
import { AppIcons } from '@shared/types/appIcons';

@Component({
  selector: 'trucks-action-button',
  templateUrl: './actions-button.component.html',
  styleUrl: './actions-button.component.scss',
  imports: [IconComponent],
  providers: [DialogService]
})
export class TrucksActionButtonComponent {
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);

  public readonly allTrucks = input.required<Array<TruckViewModel>>();
  public readonly locations = input<Array<SmallLocationViewModel>>();
  public readonly hoppers = input<Array<HopperViewModel>>();
  public readonly residueTypes = input<Array<ResidueType>>();

  public onNewTruck = output<any>();

  public readonly AppIcons = AppIcons;

  public handleCreate() {
    this.dialogService.open(NewTruckComponent, {
      header: this.translateService.instant('newTruckEntry.title'),
      width: '80vw',
      modal: true,
      inputValues: {
        allTrucks: this.allTrucks(),
        locations: this.locations(),
        hoppers: this.hoppers(),
        residueTypes: this.residueTypes(),
        onNewTruck: this.createTruck
      },
    });
  }

  public createTruck = (values: any) => {
    this.onNewTruck.emit(values);
  }
}

