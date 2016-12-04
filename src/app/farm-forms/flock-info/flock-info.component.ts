import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Flock } from '../../farm/shared/flock.model';

@Component({
  selector: 'app-flock-info',
  templateUrl: './flock-info.component.html',
  styleUrls: ['./flock-info.component.scss']
})
export class FlockInfoComponent {

    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.form = this.buildForm();
    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit(data: formModel) {
        if (this.form.valid) {
            let flock = new Flock(
                data.type,
                data.coopSize,
                data.coopName,
                data.name
            );
            this.save.emit(flock);
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

interface formModel {
    type: any;
    coopSize: any;
    coopName: any;
    name: any;
}
