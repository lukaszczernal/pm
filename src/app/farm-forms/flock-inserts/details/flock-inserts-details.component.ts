import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { FlockInsert } from '../shared/flock-insert.model';
import { FlockInsertsService } from '../shared/flock-inserts.service';

@Component({
  selector: 'app-flock-inserts-details',
  templateUrl: './flock-inserts-details.component.html',
  styleUrls: ['./flock-inserts-details.component.scss']
})
export class FlockInsertsDetailsComponent implements OnInit, OnDestroy {

    @ViewChild('form') form: NgForm;

    model: FlockInsert;

    private submit: Subject<any> = new Subject();
    private errorSub: Subscription;
    private addSub: Subscription;
    private updateSub: Subscription;

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private flockInsertsService: FlockInsertsService
    ) {}

    ngOnInit() {

        let validFormModel = this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value));

        this.model = new FlockInsert({});

        this.route.params
            .filter(params => Boolean(params['flockInsertId']))
            .map(params => params['flockInsertId'])
            .flatMap(id => this.flockInsertsService.get(id))
            .subscribe(insertion => {
                this.ngZone.run(() => {
                    this.model = new FlockInsert(insertion);
                });
            });

        this.errorSub = this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .subscribe(this.showValidationMsg);

        this.addSub = validFormModel
            .filter(model => Boolean(model.id))
            .flatMap(model => this.flockInsertsService.update(model))
            .subscribe(() => this.exit());

        this.updateSub = validFormModel
            .filter(model => !model.id)
            .flatMap(model => this.flockInsertsService.add(model))
            .subscribe(() => this.exit());

    }

    ngOnDestroy() {
        this.errorSub.unsubscribe();
        this.addSub.unsubscribe();
        this.updateSub.unsubscribe();
    }

    onSubmit(form: any) {
        this.submit.next(form);
    }

    onCancel() {
        this.exit();
    }

    errorMsgVisible(field): boolean {
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
