import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Farm } from '../farm.service';

@Component({
    selector: 'app-add-flock',
    templateUrl: './add-flock.component.html',
    styleUrls: ['./add-flock.component.scss']
})
export class AddFlockComponent {

    form: FormGroup;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private farm: Farm,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.form = this.buildForm();
        this.form.statusChanges.subscribe(this.onStatusChange.bind(this));
    }

    onSubmit(formValue) {
        this.submitted = true;
        let newFlock = this.farm.addFlock(formValue.flockName);
        this.router.navigate(['../flock', newFlock.id], {relativeTo: this.activatedRoute});
        return false;
    }

    isErrorMsgVisible(fieldName): boolean {
        let field = this.form.controls[fieldName];
        return (field.invalid && field.dirty) || (field.invalid && this.submitted);
    }

    private onStatusChange(status) {
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
