import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockTypeService } from '../shared/service/flock-type.service';
import { FlockService } from './flock.service';
import { Flock } from '../models/flock.model';
import { Subject, } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './flock.component.html',
    styleUrls: ['./flock.component.scss']
})
export class FlockComponent implements OnInit, OnDestroy {

    currentFlock: Subject<Flock> = new Subject(); // TODO check if i need this

    growthDays: number;
    growthDaysTotal: number;
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
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {

        console.count('Flock Component - OnInit');

        this.subs.push(this.route.params
            .map(route => route.id)
            .distinctUntilChanged()
            .do((id) => console.log('flock component - router event', id))
            .subscribe(this.flockService.currentFlockId)
        );

        this.subs.push(this.flockInsertsService.growthDays
            .subscribe(growthDays => this.zone.run(() => {
                this.growthDays = growthDays;
            }))
        );

        this.subs.push(this.flockInsertsService.flockInserts
            .do((flock) => console.log('flock component - flock inserts - length', flock.length))
            .map(inserts => Boolean(inserts.length))
            .subscribe(hasInserts => this.zone.run(() => {
                this.hasInserts = hasInserts;
            }))
        );

        this.subs.push(this.flockService.currentFlockType
            .map(type => type.breedingPeriod)
            .subscribe(days =>
                this.zone.run(() => this.growthDaysTotal = days)
            )
        );

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
