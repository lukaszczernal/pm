import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { BaseForm } from '../shared/base-form';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../../shared/service/flock.service';
import { FlockQuantity } from '../../models/flock-quantity.model';
import { FlockBreedingService } from '../shared/flock-breeding.service';
import * as _ from 'lodash';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
    templateUrl: './closing.component.html',
    styleUrls: ['./closing.component.scss']
})
export class ClosingComponent extends BaseForm implements OnInit {


    public model: Observable<Flock>;

    private currentItemId: Observable<number>;
    private currentItem: Observable<Flock>;

    private delete: Subject<number> = new Subject();

    constructor(
        private flockBreeding: FlockBreedingService,
        private flocks: FlocksService,
        private flock: FlockService,
        private dialog: MatDialog,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockClosing Component - OnInit');

        this.currentItem = this.flock.currentFlock
            .map(dates => _.cloneDeep(dates))  // TODO immutable.js?
            .switchMapTo(this.flockBreeding.currentBreedingDate, (flock, today) =>
                this.setDefaultFodderQty(flock, today)
                    (this.setDefaultLostFlocksCount)
                    (this.setDefaultCloseDate)
            );

        this.model = this.currentItem
            .startWith(new Flock({}))
            .do((flock) => console.log('flock-closing details', flock))
            .publishReplay(1)
            .refCount();

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock-closing details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid)
            .map(form => form.value)
            .withLatestFrom(this.flock.currentFlockId, (form, flockId) => {
                form.flock = form.flock || flockId;
                return form;
            })
            .withLatestFrom(this.model, (form, model) => model.update(form))
            .do(model => console.log('flock-closing details - submit valid', model))
            .subscribe(this.flocks.close);

        this.delete
            .withLatestFrom(this.flock.currentFlockId, (trigger, flockId) => flockId)
            .map(id => ({
                data: { id, question: 'Czy napewno chcesz trwale usunąć stado wraz jego danymi?' }
            }))
            .mergeMap(config => this.dialog.open(ConfirmationDialogComponent, config).afterClosed())
            .filter(result => Boolean(result))
            .subscribe(flockId => {
                this.flocks.remove.next(flockId);
                this.router.navigate(['/farm']);
            });

    }

    deleteCurrentFlock() {
        this.delete.next();
    }

    private setDefaultCloseDate(flock: Flock, today: FlockBreedingDate): any {
        flock.closeDate = flock.closeDate || new Date();
        return flock;
    }

    private setDefaultFodderQty(flock: Flock, today: FlockBreedingDate): any {
        flock.remainingFodder = flock.remainingFodder !== undefined ? flock.remainingFodder : Math.round(today.fodderQuantity);
        return (f) => f(flock, today);
    }

    private setDefaultLostFlocksCount(flock: Flock, today: FlockBreedingDate): any {
        flock.lostFlocks = today.quantity;
        return (f) => f(flock, today);
    }

}
