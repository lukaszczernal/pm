import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockTypeService } from '../shared/service/flock-type.service';
import { FlockService } from 'app/shared/service/flock.service';
import { Flock } from '../models/flock.model';
import { Subject, } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FlockAnalyticsService } from './shared/flock-analytics.service';

import 'rxjs/add/operator/takeUntil';

@Component({
    templateUrl: './flock.component.html',
    styleUrls: ['./flock.component.scss']
})
export class FlockComponent implements OnInit, OnDestroy {

    currentFlock: Subject<Flock> = new Subject(); // TODO check if i need this

    growthDays: Observable<number>;
    growthDaysTotal: Observable<number>;
    flockName: Observable<string>;

    private onDestroy: Subject<any> = new Subject();

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService,
        private router: Router,
        private route: ActivatedRoute,
        flockAnalytics: FlockAnalyticsService // This service is declare just to instantiate it
    ) {}

    ngOnInit() {

        console.count('Flock Component - OnInit');

        this.route.params
            .map(route => route.id)
            .distinctUntilChanged()
            .map(id => parseInt(id, 10))
            .takeUntil(this.onDestroy)
            .subscribe(
                id => this.flockService.currentFlockId.next(id)
            );

        this.growthDays = this.flockService.currentFlock
            .switchMapTo(this.flockInsertsService.growthDays);

        this.growthDaysTotal = this.flockService.currentFlockType
            .map(type => type.breedingPeriod);

        this.flockName = this.flockService.currentFlock
            .map(flock => flock.name);

    }

    ngOnDestroy() {
        this.onDestroy.next();
        this.onDestroy.complete();
    }

};
