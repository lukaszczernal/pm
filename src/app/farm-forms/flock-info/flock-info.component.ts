import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Flock } from '../../farm/shared/flock.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-flock-info',
  templateUrl: './flock-info.component.html',
  styleUrls: ['./flock-info.component.scss']
})
export class FlockInfoComponent implements OnInit {

    @Input() model: Observable<Flock>;
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.form = this.buildForm();

        if (this.model) {
            this.model
                .subscribe(flock => this.form.patchValue(flock));
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
            name: ['', Validators.required ]
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
