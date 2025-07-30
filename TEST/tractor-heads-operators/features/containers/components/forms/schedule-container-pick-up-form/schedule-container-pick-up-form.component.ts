import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

import { TractorHeadViewModel } from 'app/modules/tractor-heads-operators/view-models/tractor-head.view-model';
import {
  LocationViewModel,
  SmallLocationViewModel,
} from '@features/locations/view-model/location.view-model';
import { ContainerPickUpViewModel } from '../../../view-model/container.view-model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface ContainerFormModel {
  tractorHead: FormControl<TractorHeadViewModel | null>;
  destination: FormControl<LocationViewModel | null>;
  date: FormControl<Date | null>;
}

@Component({
  selector: 'tractor-head-operators-schedule-pick-up-form',
  templateUrl: './schedule-container-pick-up-form.component.html',
  styleUrl: './schedule-container-pick-up-form.component.scss',
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    DatePickerModule,
    SelectModule,
    FluidModule,
    FloatLabelModule,
    CommonModule,
    MessageModule,
    TranslateModule
  ],
})
export class ScheduleContainerPickUpFormComponent implements OnInit {
  public tractorHeadList = input.required<{
    suggestions: Array<TractorHeadViewModel>;
    others: Array<TractorHeadViewModel>;
  }>();
  public destinations = input.required<{
    suggestions: Array<SmallLocationViewModel>;
    others: Array<SmallLocationViewModel>;
  }>();
  public container = input.required<ContainerPickUpViewModel>();
  public readonly onCancel = output<void>();
  //TODO: refactor
  public readonly onSubmit = output<{
    tractorHead: TractorHeadViewModel;
    destination: LocationViewModel;
    date: Date;
  }>();

  public minDate: Date = new Date();
  public form!: FormGroup;
  public tractorHeadSearch = signal('');
  public tractorHeadsOptions = computed(() => [
    {
      label: 'Sugerencias',
      items: this.tractorHeadList().suggestions.map((th) => ({
        label: th.plate,
        value: th,
      })),
    },
    {
      label: 'Otros',
      items: this.tractorHeadList().others.map((th) => ({
        label: th.plate,
        value: th,
      })),
    },
  ]);
  public destinationOptions = computed(() => [
    {
      label: 'Sugerencias',
      items: this.destinations().suggestions.map((loc) => ({
        label: loc.name,
        value: loc,
      })),
    },
    {
      label: 'Otros',
      items: this.destinations().others.map((loc) => ({
        label: loc.name,
        value: loc,
      })),
    },
  ]);

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.fb.group<ContainerFormModel>({
      tractorHead: this.fb.control<TractorHeadViewModel | null>(null, {
        validators: [Validators.required],
      }),
      destination: this.fb.control<LocationViewModel | null>(
        null,
        Validators.required
      ),
      date: this.fb.control<Date | null>(null, Validators.required),
    });
  }

  public handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { tractorHead, destination, date } = this.form.value;

    this.onSubmit.emit({
      tractorHead,
      destination,
      date,
    });
  }

  public handleCancel(): void {
    this.onCancel.emit();
  }
}