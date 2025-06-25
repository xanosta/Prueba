import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TruckViewModel } from '../../../view-models/truck.view-model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import {
  isGreaterThan,
  formatDateFromMilisecs,
} from '@shared/utils/date.utils';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { MessageService } from 'primeng/api';
import { TrucksEntriesStore } from '../../../store/truck-entries.store';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { HoppersStore } from 'app/modules/plant-operators/features/hoppers/store/hoppers.store';

interface FormFields {
  originIds: FormControl<Array<number>>;
  residueTypeId: FormControl<string>;
  arrivalWeight: FormControl<number | null>;
  dateTimeUnload: FormControl<Date | null>;
  hopperId: FormControl<number | null>;
  exitWeight: FormControl<number | null>;
}

@Component({
  selector: 'plant-trucks-update-form',
  templateUrl: './update-form.component.html',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    FloatLabelModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    DatePickerModule,
    InputNumberModule,
  ],
})
export class UpdateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly trucksStore = inject(TrucksEntriesStore);
  private readonly locationsStore = inject(LocationsStore);
  private readonly hoppersStore = inject(HoppersStore);

  public readonly truck = input.required<TruckViewModel>();
  public truckForm!: FormGroup;

  public isPartialEdit = signal<boolean>(true);
  public currentDate = new Date();
  public container = computed(() => {
    if (this.truck().containers.length === 0) return '-';

    return this.truck()
      .containers.map(({ code }) => code)
      .join(', ');
  });
  public residueWeight = computed(() => {
    const data = this.truck();

    if (!data || data.weightResidue < 0) return '-';

    return `${data.weightResidue} kg`;
  });

  constructor() {
    effect(() => {
      const truck = this.truck();

      if (!truck) return;

      const canBeFullEdited = this.canBeFullEdited(truck);

      this.isPartialEdit.set(!canBeFullEdited);

      if (!this.isPartialEdit()) return;

      this.disableForms([
        'arrivalWeight',
        'exitWeight',
        'hopperId',
        'dateTimeUnload',
      ]);
    });

    effect(() => {
      const isPartialEdit = this.isPartialEdit();

      if (!isPartialEdit) return;

      this.notifyUntilFullEditable(this.truck().canBeModifyAfter);
    });
  }

  public ngOnInit(): void {
    let dateTime: Date | null = null;

    if (!this.truck()) return;

    if (this.truck().datetimeUnloadBegin)
      //@ts-ignore
      dateTime = new Date(this.truck().dateTimeUnloadBegin);

    this.truckForm = new FormGroup<FormFields>({
      originIds: new FormControl<Array<number>>(
        [...this.truck().origins.map((location) => location.id)],
        { nonNullable: true }
      ),
      residueTypeId: new FormControl<string>(this.truck().residueType, {
        nonNullable: true,
      }),
      arrivalWeight: new FormControl<number | null>(this.truck().arrivalWeight),
      dateTimeUnload: new FormControl<Date | null>(dateTime),
      hopperId: new FormControl<number | null>(
        this.truck()?.hopper?.id ?? null
      ),
      exitWeight: new FormControl<number | null>(this.truck().exitWeight),
    });
  }

  public async handleSubmit() {
    if (this.truckForm.invalid) {
      const invalidFields: string[] = [];

      if (this.truckForm.get('dateTimeUnload')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.unloadDate'
          )
        );
      }
      if (this.truckForm.get('originIds')?.invalid) {
        invalidFields.push(
          this.translateService.instant('truck.form.entrySection.fields.origin')
        );
      }
      if (this.truckForm.get('arrivalWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.entryWeight'
          )
        );
      }
      if (this.truckForm.get('exitWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.exitWeight'
          )
        );
      }
      if (this.truckForm.get('hopperId')?.invalid) {
        invalidFields.push(
          this.translateService.instant('truck.form.entrySection.fields.hopper')
        );
      }

      const msg = invalidFields.join(', ');
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant(
          'truck.errors.missingFields.title'
        ),
        detail: msg,
      });
      return;
    }

    const value = this.truckForm.value;
    if (value.dateTimeUnload)
      value.dateTimeUnload = new Date(value.dateTimeUnload).toISOString();

    try {
      this.trucksStore.updateTruck(this.truck().id, value);

      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('truck.messages.update.title'),
        detail: this.translateService.instant(
          'truck.messages.update.description'
        ),
      });
    } catch (error: any) {
      console.error('Error updating origin and residue type:', error);

      if (error && 'status' in error) {
        switch (error.status) {
          case 409:
            //Maybe we should use custom error codes in error messages

            const residueTypeLabel: string = this.translateService.instant(
              `enums.residueTypes.${value.residueTypeId}`
            );

            const selectedOrigins = this.originsOptions
              .filter((option) => value.originIds.includes(option.value))
              .map((option) => option.label)
              .join(', ');

            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant(
                'truck.errors.originsAggrupation.title'
              ),
              detail: this.translateService.instant(
                'truck.errors.originsAggrupation.description',
                {
                  origins: selectedOrigins,
                  residueType: residueTypeLabel,
                }
              ),
            });

            break;
          default:
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant(
                'truck.errors.update.title'
              ),
              detail: this.translateService.instant(
                'truck.errors.update.description'
              ),
            });
            break;
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('truck.errors.update.title'),
          detail: this.translateService.instant(
            'truck.errors.update.description'
          ),
        });
      }

      this.handleCancel();
    }
  }

  public handleCancel() {
    const truck = this.truck();

    if (!truck) return;

    const {
      origins,
      residueType,
      arrivalWeight,
      datetimeUnloadBegin,
      hopper,
      exitWeight,
    } = truck;

    this.truckForm.reset({
      originIds: origins.map((location) => location.id),
      residueTypeId: residueType,
      arrivalWeight: arrivalWeight,
      dateTimeUnload: datetimeUnloadBegin,
      hopperId: hopper?.id,
      exitWeight: exitWeight,
    });

    this.router.navigate(['trucks']);
  }

  private canBeFullEdited(truck: TruckViewModel): boolean {
    if (truck.datetimeExit) return true;

    if (!truck.canBeModifyAfter) return true;

    if (isGreaterThan(new Date(), new Date(truck.canBeModifyAfter)))
      return true;

    return false;
  }

  private disableForms(formFields: Array<keyof FormFields>): void {
    formFields.forEach((field) => this.truckForm.get(field)?.disable());
  }

  private notifyUntilFullEditable(allowedModifyDate: Date) {
    const currentTime = new Date().getTime();
    const timeLeft = allowedModifyDate.getTime() - currentTime;
    const dateFormated = formatDateFromMilisecs(timeLeft);

    this.messageService.add({
      severity: 'warn',
      summary: this.translateService.instant('truck.errors.notEditable.title'),
      detail: this.translateService.instant(
        'truck.errors.notEditable.description',
        { mins: dateFormated.minutes, secs: dateFormated.seconds }
      ),
    });
  }

  get originsOptions() {
    return this.locationsStore
      .locations()
      .map((origin) => ({ value: origin.id, label: origin.name }));
  }

  get residueTypeOptions() {
    return [
      {
        value: ResidueType.AMARELA,
        label: this.translateService.instant('enums.residueTypes.AMARELA'),
      },
      {
        value: ResidueType.NEGRA,
        label: this.translateService.instant('enums.residueTypes.NEGRA'),
      },
      // { value: ResidueType.Marron, label: this.translateService.instant("enums.residueTypes.MARRON") },
    ];
  }

  get hoppers() {
    return this.hoppersStore.locationHoppers().map((hopper) => ({
      value: hopper.id,
      label: hopper.name,
    }));
  }
}
