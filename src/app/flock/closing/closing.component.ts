import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { BaseForm } from '../shared/base-form';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../flock.service';
import { FlockQuantityService } from '../shared/flock-quantity.service';
import { FlockQuantity } from '../../models/flock-quantity.model';
import { FlockBreedingService } from '../shared/flock-breeding.service';

@Component({
    templateUrl: './closing.component.html',
    styleUrls: ['./closing.component.scss']
})
export class ClosingComponent extends BaseForm implements OnInit {


    public model: Observable<Flock>;

    private currentItemId: Observable<number>;
    private currentItem: Observable<Flock>;

    constructor(
        private flockQuantity: FlockQuantityService,
        private flockBreeding: FlockBreedingService,
        private flocks: FlocksService,
        private flock: FlockService,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockClosing Component - OnInit');

        this.currentItem = this.flock.currentFlockId
            .flatMap(id => this.flocks.get(id))
            .map(this.setDefaultCloseDate)
            .flatMap(() => this.flockBreeding.currentBreedingDate
                .map(today => today.fodderQuantity), this.setDefaultFodderQty)
            .flatMap(() => this.flockBreeding.currentBreedingDate
                .map(today => today.quantity), this.setDefaultLostFlocksCount);

        this.model = this.currentItem
            .startWith(new Flock({}))
            .do((flock) => console.log('flock-closing details', flock))
            // .share();
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
            .subscribe(this.flocks.update);

    }

    private setDefaultCloseDate(flock: Flock): Flock {
        flock.closeDate = flock.closeDate || new Date();
        return flock;
    }

    private setDefaultFodderQty(flock: Flock, fodderQty: number): Flock {
        flock.remainingFodder = fodderQty;
        return flock;
    }

    private setDefaultLostFlocksCount(flock: Flock, flockQuantity: FlockQuantity): Flock {
        flock.lostFlocks = flockQuantity.total;
        return flock;
    }

}
