import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockTypeService } from '../../farm/shared/flock-type.service';
import { FlockInsertsService } from './flock-inserts.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class FlockDatesService {

    public breedingPeriod: Observable<number>;
    public breedingDates: Observable<Date[]>;
    public breedingDatesString: Observable<string[]>;

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService
    ) {
        console.count('FlockDatesService constructor');

        this.breedingPeriod = this.flockService.currentFlockType
            .map(flockType => flockType.breedingPeriod)
            .publishReplay(1)
            .refCount();

        this.breedingDates = this.breedingPeriod
            .combineLatest(this.flockInsertsService.startDate,
                (breedingPeriod, startDate): [number, Date] => [breedingPeriod, startDate])
            .map(([breedingPeriod, startDate]) => Array
                .from({length: breedingPeriod + 1}, (v, i) => moment(startDate).add(i, 'days').toDate())
            )
            .publishReplay(1)
            .refCount();

        this.breedingDatesString = this.breedingDates
            .map(dates => dates
                .map(date => date.toString())
            )
            .publishReplay(1)
            .refCount();

    }
}