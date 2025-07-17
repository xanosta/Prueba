import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FloatLabel } from "primeng/floatlabel";
import { MultiSelect } from "primeng/multiselect";
import { Select } from "primeng/select";
import { TruckViewModel } from "../../../view-models/truck.view-model";
import { MessageModule } from 'primeng/message';
import { LocationsStore } from "@features/locations/store/locations.store";

export interface FormFields {
    originIds: FormControl<Array<number>>;
    residueTypeId: FormControl<string>;
}

export interface OutputFields {
    originIds: Array<number>;
    residueTypeId: string;
}

@Component({
    selector: 'domiciliary-truck-validation-form',
    templateUrl: './validation-form.component.html',
    styleUrl: './validation-form.component.scss',
    imports: [
        ReactiveFormsModule,
        FloatLabel,
        MultiSelect,
        Select,
        TranslateModule,
        MessageModule
    ]
})
export class DomiciliaryTruckValidationFormComponent implements OnInit {
    public locationsStore = inject(LocationsStore);
    public readonly truck = input.required<TruckViewModel>();
    public readonly persistentDataForm = input<OutputFields>();

    public continueOutput = output<OutputFields>();
    public cancelOutput = output<void>();

    public error = signal<string | undefined>(undefined);

    public truckForm!: FormGroup;

    private readonly translateService = inject(TranslateService);

    ngOnInit(): void {
        const truck = this.truck();

        this.truckForm = new FormGroup<FormFields>({
            originIds: new FormControl<Array<number>>(
                this.persistentDataForm()
                    ?
                    this.persistentDataForm()!.originIds
                    :
                    truck.origins?.map((location) => location.locationId) ?? [],
                { nonNullable: true },
            ),
            residueTypeId: new FormControl<string>(
                this.persistentDataForm()
                    ?
                    this.persistentDataForm()!.residueTypeId
                    :
                    this.truck().residueType?.[0] ?? '',
                { nonNullable: true }
            )
        });
    }

    get residueTypeOptions() {
        return this.locationsStore.selectedLocation()?.residueTypes.map((residueType) => ({
            value: residueType,
            label: this.translateService.instant(`enums.residueTypes.${residueType}`),
        }));
    }

    public async handleSubmit() {
        if (!this.truckForm.value.originIds || this.truckForm.value.originIds.length === 0) {
            const invalidOrigin = this.translateService.instant('truck.verifyModal.errors.origin');

            this.error.set(invalidOrigin);

            return;
        }

        this.continueOutput.emit(this.truckForm.value);
    }

    public handleCancel(): void {
        this.cancelOutput.emit();
    }
}
