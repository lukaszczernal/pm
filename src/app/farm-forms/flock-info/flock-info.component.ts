import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flock-info',
  templateUrl: './flock-info.component.html',
  styleUrls: ['./flock-info.component.scss']
})
export class FlockInfoComponent {

    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    form: FormGroup;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.form = this.buildForm();
        this.form.statusChanges.subscribe(this.onFormStatusChange.bind(this));
    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit(data) {
        this.submitted = true;
        if (this.form.valid) {
            this.save.emit(data);
        };
        return false;
    }

    errorMsgVisible(fieldName): boolean {
        let field = this.form.controls[fieldName];
        return (field.invalid && field.dirty) || (field.invalid && this.submitted);
    }

    private onFormStatusChange(status) {
        if (status === 'VALID') {
            this.submitted = false;
        }
    }

    private buildForm() {
        return this.formBuilder.group({
            flockType: '',
            coopSize: '',
            coopName: '',
            flockName: ['', Validators.required ]
        });
    }

}
