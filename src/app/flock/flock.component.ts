import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockTypeService } from '../farm/shared/flock-type.service';
import { FlockService } from '../farm/shared/flock.service';
import { FlockInsert } from './shared/flock-insert.model';
import { FlockType } from '../farm/shared/flock-type.model';
import { Flock } from '../farm/shared/flock.model';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
    templateUrl: './flock.component.html'
})
export class FlockComponent implements OnInit {

    currentFlock: Subject<Flock> = new Subject();
    setFlockId: Subject<number> = new Subject();
    currentFlockType: ReplaySubject<FlockType> = new ReplaySubject();
    currentFlockInserts: Subject<FlockInsert[]> = new Subject();
    routeChange: Subject<any> = new Subject(); // TOOD typings
    firstInsertion: Subject<any> = new Subject(); // TOOD typings

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService,
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone
    ) {}

    ngOnInit() {

        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.route.snapshot.firstChild.params['id'])
            .distinctUntilChanged()
            .do((id) => console.log('flock component - router event', id))
            .subscribe(this.setFlockId);

        this.setFlockId
            .flatMap((id) => this.flockService.get(id))
            .do((flock) => console.log('flock component - current flock', flock))
            .subscribe(this.currentFlock);

        this.currentFlock
            .map(flock => flock.type)
            .do((flock) => console.log('flock component - current flock type', flock))
            .flatMap(typeId => this.flockTypeService.get(typeId))
            .subscribe((flockType) => this.zone.run(() => {
                this.currentFlockType.next(flockType);
            }));

        this.setFlockId
            .do((id) => console.log('flock component - current flock id', id))
            .subscribe(this.flockInsertsService.setFlockId);

        this.flockInsertsService.flockInserts
            .map(inserts => inserts[0]) // TOOD - not a clean code - flockInserts are ordered by createDate ASC
            .filter(insert => Boolean(insert))
            .map(insertion => insertion.createDate)
            .map(createDate => {
                let durationFromFirstInsertion = new Date().getTime() - createDate.getTime();
                return moment.duration(durationFromFirstInsertion).days();
            })
            .do((date) => console.log('flock component - current flock first insertion day passed', date))
            .subscribe(days => this.zone.run(() => this.firstInsertion.next(days)));


    }

};
