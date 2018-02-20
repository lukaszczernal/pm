import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';
import { FlockService } from '../../../flock/flock.service';
import { Moment } from 'moment';
import * as moment from 'moment';

import 'rxjs/add/operator/mergeMapTo'
import 'rxjs/add/operator/withLatestFrom'

@Component({
  selector: 'app-flock-inserts-details',
  templateUrl: './flock-inserts-details.component.html',
  styleUrls: ['./flock-inserts-details.component.scss']
})
export class FlockInsertsDetailsComponent implements OnInit {

    @ViewChild('form') form: NgForm;

    model: Observable<FlockInsert>;

    private submit: Subject<any> = new Subject();

    private currentInsertId: Observable<number>;
    private currentInsert: Observable<FlockInsert>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flockService: FlockService,
        private flockInsertsService: FlockInsertsService
    ) {}

    ngOnInit() {

        console.count('FlockInsertDetails Component - OnInit');

        this.currentInsertId = this.route.params
            .filter(params => Boolean(params['flockInsertId']))
            .map(params => params['flockInsertId'])
            .do((flockId) => console.log('flock inserts details - route', flockId));

        this.currentInsert = this.currentInsertId
            .do((flockId) => console.log('flock inserts details - id', flockId))
            .flatMap(id => this.flockInsertsService.get(id));

        this.model = this.currentInsert
            .startWith(new FlockInsert({}))
            .do((flock) => console.log('flock inserts details - insert', flock))
            .publishReplay(1)
            .refCount();

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock inserts details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => form.value)
            .mergeMapTo(this.flockService.currentFlockId, (form, flockId) => {
                form.flock = form.flock || flockId;
                return form;
            })
            .withLatestFrom(this.model, (form, model) => model.update(form))
            .do(model => console.log('flock inserts details - submit valid', model))
            .subscribe(this.flockInsertsService.update);

        this.flockInsertsService.update
            .subscribe(() => this.exit());

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

    insertionDatepickerFilter(date: Date): boolean {
        // return moment().startOf('day').isSameOrBefore(date); // TODO this should take breeding start date instead of todays date
        return true;
    }

    private exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    private showValidationMsg(controls) { // TODO move to base form component class
        for (const key in controls) {
            if (controls.hasOwnProperty(key)) {
                const control = controls[key];
                control.markAsDirty();
                if (control instanceof FormGroup) {
                    this.showValidationMsg(control.controls);
                }
            }
        }
    }

}
