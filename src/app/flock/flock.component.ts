import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockTypeService } from '../farm/shared/flock-type.service';
import { FlockService } from './flock.service';
import { Flock } from '../farm/shared/flock.model';
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
    templateUrl: './flock.component.html',
})
export class FlockComponent implements OnInit, OnDestroy {

    currentFlock: Subject<Flock> = new Subject();

    growthDays: number;
    growthDaysTotal: number;
    // growthDaysTotal: Observable<number>;
    hasInserts: boolean;

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

        this.subs.push(this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.route.snapshot.firstChild.params['id'])
            .distinctUntilChanged()
            .do((id) => console.log('flock component - router event', id))
            .subscribe(this.flockService.currentFlockId)
        );

        this.subs.push(this.flockInsertsService.flockInserts
            .map(inserts => inserts[0]) // TOOD - not a clean code - flockInserts are ordered by createDate ASC
            .filter(insert => Boolean(insert))
            .map(insertion => insertion.createDate)
            .map(createDate => {
                let durationFromFirstInsertion = new Date().getTime() - createDate.getTime();
                return moment.duration(durationFromFirstInsertion).days();
            })
            .do((date) => console.log('flock component - current flock first insertion day passed', date))
            .subscribe(growthDays => this.growthDays = growthDays)
        );

        this.subs.push(this.flockInsertsService.flockInserts
            .do((flock) => console.log('flock component - flock inserts - length', flock.length))
            .map(inserts => Boolean(inserts.length))
            .subscribe(hasInserts => this.hasInserts = hasInserts)
        );

        this.subs.push(this.flockService.currentFlock
            .map(flock => flock.type)
            .flatMap(typeId => this.flockTypeService.get(typeId))
            .do((flock) => console.log('flock component - current flock get type', flock))
            .map(type => type.breedingPeriod)
            .subscribe((totalGrowthDays) => this.zone.run(() => {
                this.growthDaysTotal = totalGrowthDays;
            }))
        );

    }

    ngOnDestroy() {
        // this.subs.map(sub => sub.unsubscribe());
    }

};
