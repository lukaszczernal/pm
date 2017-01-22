import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';
import { FlockService } from '../../../flock/flock.service';

@Component({
  selector: 'app-flock-inserts-details',
  templateUrl: './flock-inserts-details.component.html',
  styleUrls: ['./flock-inserts-details.component.scss']
})
export class FlockInsertsDetailsComponent implements OnInit {

    @ViewChild('form') form: NgForm;

    model: FlockInsert;

    private submit: Subject<any> = new Subject();

    private currentInsertId: Observable<number>;
    private currentInsert: Observable<FlockInsert>;

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private flockService: FlockService,
        private flockInsertsService: FlockInsertsService
    ) {}

    ngOnInit() {

        console.count('FlockInsertDetails Component - OnInit');

        this.model = new FlockInsert({});

        this.currentInsertId = this.route.params
            .filter(params => Boolean(params['flockInsertId']))
            .map(params => params['flockInsertId'])
            .do((flockId) => console.log('flock inserts details - route', flockId));

        this.currentInsert = this.currentInsertId
            .do((flockId) => console.log('flock inserts details - id', flockId))
            .flatMap(id => this.flockInsertsService.get(id));

        this.currentInsert
            .do((flock) => console.log('flock inserts details - insert', flock))
            .subscribe(insertion => this.ngZone.run(() => {
                this.model = new FlockInsert(insertion);
            }));

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock inserts details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value))
            .map((model) => this.updateFlockId(model))
            .do((model) => console.log('flock inserts details - submit valid', model))
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

    private updateFlockId(model: FlockInsert): FlockInsert {
        model.flock = this.route.snapshot.params['id'];
        return model;
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
