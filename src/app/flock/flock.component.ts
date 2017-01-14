import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FlockService } from '../farm/shared/flock.service';
import { FlockTypeService } from '../farm/shared/flock-type.service';
import { FlockType } from '../farm/shared/flock-type.model';
import { Flock } from '../farm/shared/flock.model';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Component({
    templateUrl: './flock.component.html'
})
export class FlockComponent implements OnInit {

    currentFlock: Subject<Flock> = new Subject();
    currentFlockId: Subject<number> = new Subject();
    currentFlockType: ReplaySubject<FlockType> = new ReplaySubject();
    routeChange: Subject<any> = new Subject();

    constructor(
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
            .subscribe(this.currentFlockId);

        this.currentFlockId
            .flatMap((id) => this.flockService.get(id))
            .do((flock) => console.log('flock component - current flock', flock))
            .subscribe(this.currentFlock);

        this.currentFlock
            .map(flock => flock.type)
            .do((flock) => console.log('flock component - current flock type', flock))
            .flatMap(typeId => this.flockTypeService.get(typeId))
            .subscribe((flockType) => {
                this.zone.run(() => this.currentFlockType.next(flockType));
            });

    }

};
