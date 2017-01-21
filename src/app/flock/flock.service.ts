import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { Flock } from '../farm/shared/flock.model';
import { FlocksService } from '../farm/shared/flocks.service';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class FlockService {

    public currentFlockId: ReplaySubject<number> = new ReplaySubject();
    public currentFlock: ReplaySubject<Flock> = new ReplaySubject();

    constructor(
        private flocksService: FlocksService,
        private ngZone: NgZone
    ) {
        console.count('FlockService constructor');

        this.currentFlockId
            .flatMap((id) => this.flocksService.get(id))
            .do((flock) => console.log('flock service - current flock', flock))
            .subscribe(this.currentFlock);


    }

}
