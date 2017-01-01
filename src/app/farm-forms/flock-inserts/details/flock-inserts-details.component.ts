import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FlockInsert } from '../shared/flock-insert.model';
import { FlockInsertsService } from '../shared/flock-inserts.service';

@Component({
  selector: 'app-flock-inserts-details',
  templateUrl: './flock-inserts-details.component.html',
  styleUrls: ['./flock-inserts-details.component.scss']
})
export class FlockInsertsDetailsComponent implements OnInit, AfterViewInit {

    @ViewChild('form') form: NgForm;
    // @ViewChild('quantity') formQuantity: NgModel;

    model: FlockInsert;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flockInsertsService: FlockInsertsService
    ) {}

    ngOnInit() {
        this.model = new FlockInsert({quantity: 55, price: 0.55});

    }

    ngAfterViewInit() {

    }

    onSubmit(formData: FormModel) {
        console.log('formData', formData, this.form.valid );
        if (this.form.valid) {
            this.model.update(formData);
            this.flockInsertsService.add(this.model)
                .toPromise()
                .then(this.exit.bind(this)); // TODO redirect to new flock menu
        } else {
            this.showValidationMsg(this.form.controls);
        };
        return false;
    }

    onCancel() {
        this.exit();
    }

    errorMsgVisible(fieldName): boolean {
        let field = this.form.controls[fieldName];
        if (field) {
            return field.invalid && field.dirty;
        } else {
            return false;
        }
    }

    private exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
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
    // type: any;
    // coopSize: any;
    // coopName: any;
    // name: any;
}
