import { Component, Input, Output, EventEmitter, OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Flock } from '../../models/flock.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FlockType } from '../../models/flock-type.model';
import { FlockTypeService } from '../../shared/service/flock-type.service';

@Component({
    selector: 'app-flock-info',
    templateUrl: './flock-info.component.html',
    styleUrls: ['./flock-info.component.scss']
})
export class FlockInfoComponent implements OnInit, OnChanges {

    @Input() model: Flock;
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    form: FormGroup;
    flockTypes: FlockType[];
    flockBreadingPeriod: number;

    selectedFlockType: FlockType;
    selectedFlockTypeId: BehaviorSubject<number> = new BehaviorSubject(null);

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private flockTypeService: FlockTypeService,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model && this.form) {
            this.form.patchValue(this.model);
        }
    }

    ngOnInit() {
        this.form = this.buildForm();

        this.form.controls['type'].valueChanges
            .do(() => console.log('flock info component - valueChange'))
            .subscribe(this.selectedFlockTypeId);

        this.selectedFlockTypeId
            .switchMap((id) => this.flockTypeService.get(id))
            .do(() => console.log('flock info component - selectedFlockTypeId'))
            .subscribe((flockType) => {
                this.ngZone.run(() => this.selectedFlockType = flockType);
            });

        this.flockTypeService.flockTypes
            .do(() => console.log('flock info component - flockTypes'))
            .subscribe(types => {
                this.ngZone.run(() => this.flockTypes = types);
            });

        if (this.model) {
            this.form.patchValue(this.model);
        }

    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit(formData: FormModel) {
        if (this.form.valid) {
            this.save.emit(formData);
        } else {
            this.showValidationMsg(this.form.controls);
        };
        return false;
    }

    errorMsgVisible(fieldName): boolean {
        let field = this.form.controls[fieldName];
        return field.invalid && field.dirty;
    }

    private buildForm() {
        return this.formBuilder.group({
            type: ['', Validators.required],
            coopSize: ['', Validators.required], // TODO add number validator
            coopName: '',
            name: ['', Validators.required ],
            description: ''
        });
    }

    private showValidationMsg(controls) { // TODO move to base form component class
        for (let key in controls) {
            if (controls.hasOwnProperty(key)) {
                let control = controls[key];
                control.markAsDirty();
                if (control instanceof FormGroup) {
                    this.showValidationMsg(control.controls);
                }
            }
        }
    }

}

interface FormModel {
    type: any;
    coopSize: any;
    coopName: any;
    name: any;
}
