import { Injectable } from '@angular/core';
import { Flock } from '../models/flock.model';
import { FlockType } from '../models/flock-type.model';
import { FlocksService } from '../shared/service/flocks.service';
import { FlockTypeService } from '../shared/service/flock-type.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Moment } from 'moment';

@Injectable()
export class FlockService {

    public currentFlockId: ReplaySubject<number> = new ReplaySubject(1);
    public currentFlock: Observable<Flock>;
    public currentFlockType: Observable<FlockType>;
    public breedingPeriod: Observable<number>;
    public breedingDates: Observable<{day, number, date: Moment}[]>;

    constructor(
        private flockTypeService: FlockTypeService,
        private flocksService: FlocksService
    ) {
        console.count('FlockService constructor');

        this.currentFlock = this.currentFlockId
            .filter(flockId => Boolean(flockId))
            .flatMap((id) => this.flocksService.get(id))
            .do((flock) => console.log('flock service - current flock', flock))
            .publishReplay(1)
            .refCount();

        this.currentFlockType = this.currentFlock
            .filter(flock => Boolean(flock))
            .map(flock => flock.type)
            .flatMap(typeId => this.flockTypeService.get(typeId))
            .do((flock) => console.log('flock service - current flock get type', flock))
            .publishReplay(1)
            .refCount();

    }

}
