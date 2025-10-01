import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { CloseButtonComponent } from '../../../../../../shared/components/buttons/close-button/close-button.component';
import { DevicesStore } from '../../store/devices.store';
import { LocationsStore } from '@features/locations/store/locations.store';

interface FiltersForm {
  locationId: FormControl<number | null>;
  areaType: FormControl<string | null>;
  deviceType: FormControl<string | null>;
}

@Component({
  selector: 'app-list-devices-page-filters',
  templateUrl: './list-devices-page-filters.component.html',
  styleUrl: './list-devices-page-filters.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CloseButtonComponent,
    InputTextModule,
    SelectModule,
    TranslateModule,
  ],
})
export class ListDevicesPageFilterComponent {
  public readonly devicesStore = inject(DevicesStore);
  public readonly locationsStore = inject(LocationsStore);

  public filters: FormGroup<FiltersForm>;
  private readonly fb = inject(FormBuilder);

  //TODO: traer a partir de endpoint
  public areaTypes = [
    { label: 'Entrada', value: 'ENTRY_AREA' },
    { label: 'Plataforma de pesado', value: 'WEIGHING_PLATFORM' },
    { label: 'Tolva', value: 'HOPPER' },
  ];

  public deviceTypes = [
    { label: 'Lector de matrícula', value: 'LECTOR_MAT' },
    { label: 'Lector RFID', value: 'LECT_RFID' },
    { label: 'Bascula', value: 'BASCULA' },
    { label: 'Semáforo', value: 'SEMAFORO' },
    { label: 'GUI Transportista', value: 'GUI_TRANSP' },
    { label: 'GUI Planta', value: 'GUI_PRANTA' },
  ];

  constructor() {
    this.filters = this.fb.group<FiltersForm>({
      locationId: this.fb.control(null),
      areaType: this.fb.control(null),
      deviceType: this.fb.control(null),
    });
  }

  public handleFiltersClose(): void {
    this.devicesStore.toggleFiltersOpen(false);
  }

  public resetFilters(): void {
    this.filters.reset();
    this.devicesStore.resetFilters();
  }

  public applyFilters(): void {
    const formValues = this.filters.value;
    const activeFilters = Object.entries(formValues)
      .filter(([, value]) => value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (Object.keys(activeFilters).length > 0) {
      this.devicesStore.setFilters(activeFilters);
    }
  }
}
