import { Injectable } from '@angular/core';
import { Flock } from '../../models/flock.model';
import { FlockType } from '../../models/flock-type.model';
import { FlocksService } from './flocks.service';
import { FlockTypeService } from './flock-type.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockInsertDbService } from './flock-insert-db.service';
import { FlockInsert } from '../../flock/shared/flock-insert.model';
import * as moment from 'moment';

@Injectable()
export class FlockService {

    public currentFlockId: ReplaySubject<number> = new ReplaySubject(1);
    public currentFlock: Observable<Flock>;
    public currentFlockType: Observable<FlockType>;
    public isActive: Observable<boolean>;

    public firstInsert: Observable<FlockInsert>;
    public startDate: Observable<Date>;
    public inserts: Observable<FlockInsert[]>;

    public growthDays: Observable<number>;

    constructor(
        private flockTypeService: FlockTypeService,
        private flocksService: FlocksService,
        flockInserts: FlockInsertDbService
    ) {

        this.currentFlock = this.currentFlockId.asObservable()
            .filter(flockId => Boolean(flockId))
            .flatMap((id) => this.flocksService.get(id))
            .publishReplay(1)
            .refCount();

        this.currentFlockType = this.currentFlock
            .map(flock => flock.type)
            .flatMap(typeId => this.flockTypeService.get(typeId));

        this.isActive = this.currentFlock
            .map(flock => !flock.closeDate);

        this.inserts = this.currentFlockId
            .flatMap(flockId => flockInserts.getByFlock(flockId))

        // TODO - not a clean code - flockInserts are ordered by date ASC
        this.firstInsert = this.inserts
            .map(inserts => inserts.length > 0 ? inserts[0] : new FlockInsert({}));

        this.startDate = this.firstInsert
            .map(insert => insert.date);

        this.growthDays = this.currentFlock
            .switchMapTo(this.startDate, (flock, startDate) => {
                const endDate = flock.closeDate && new Date(flock.closeDate) || new Date();
                const durationFromFirstInsertion = endDate.getTime() - startDate.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            })
            .map(days => Math.round(days));


    }

}
