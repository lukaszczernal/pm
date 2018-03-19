import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockTypeService } from '../shared/service/flock-type.service';
import { FlockService } from 'app/shared/service/flock.service';
import { Flock } from '../models/flock.model';
import { Subject, } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FlockAnalyticsService } from './shared/flock-analytics.service';

@Component({
    templateUrl: './flock.component.html',
    styleUrls: ['./flock.component.scss']
})
export class FlockComponent implements OnInit, OnDestroy {

    currentFlock: Subject<Flock> = new Subject(); // TODO check if i need this

    growthDays: Observable<number>;
    growthDaysTotal: Observable<number>;
    hasInserts: boolean;
    flockName: string;

    private subs: Subscription[] = [];

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService,
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private ref: ChangeDetectorRef,
        flockAnalytics: FlockAnalyticsService // This service is declare just to instantiate it
    ) {}

    ngOnInit() {

        console.count('Flock Component - OnInit');

        this.subs.push(this.route.params
            .map(route => route.id)
            .distinctUntilChanged()
            .do((id) => console.log('flock component - router event', id))
            .subscribe(this.flockService.currentFlockId)
        );

        this.growthDays = this.flockInsertsService.growthDays;

        this.subs.push(this.flockInsertsService.flockInserts
            .do((flock) => console.log('flock component - flock inserts - length', flock.length))
            .map(inserts => Boolean(inserts.length))
            .subscribe(hasInserts => this.zone.run(() => {
                this.hasInserts = hasInserts;
            }))
        );

        this.growthDaysTotal = this.flockService.currentFlockType
            .map(type => type.breedingPeriod);

        this.subs.push(this.flockService.currentFlock
            .subscribe(flock =>
                this.zone.run(() => this.flockName = flock.name)
            )
        );

    }

    ngOnDestroy() {
        // this.subs.map(sub => sub.unsubscribe());
    }

};
