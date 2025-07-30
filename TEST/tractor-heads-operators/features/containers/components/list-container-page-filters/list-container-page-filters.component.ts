import { Component, inject, computed } from '@angular/core';
import { ContainersStore } from '../../store/containers.store';
import { CloseButtonComponent } from '../../../../../../shared/components/buttons/close-button/close-button.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { LocationsStore } from '@features/locations/store/locations.store';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';

interface Filters {
  locationId: FormControl<number | null>;
}

@Component({
  selector: 'tractore-heads-operator-containers-filter',
  templateUrl: './list-container-page-filters.component.html',
  imports: [ReactiveFormsModule, CloseButtonComponent, SelectModule, TranslateModule],
})
export class ListContainerPageFilter {
  public filters: FormGroup<Filters>;

  public readonly containersStore = inject(ContainersStore);
  public readonly locationsStore = inject(LocationsStore);
  private readonly fb = inject(FormBuilder);

  constructor() {
    this.filters = this.fb.group<Filters>({
      locationId: this.fb.control(null),
    });
  }

  public sortedLocations = computed(() => {
    const locations = this.locationsStore.locations();
    return [...locations].sort((a, b) => a.name.localeCompare(b.name));
  });

  public handleFiltersClose(): void {
    this.containersStore.toggleFiltersOpen(false);
  }
  resetFilters() {
    this.filters.reset();
    this.containersStore.resetFilters();
  }
  applyFilters() {
    const { locationId } = this.filters.value;

    if (!locationId) return;

    this.containersStore.setFilters({ locationId });
  }
}
