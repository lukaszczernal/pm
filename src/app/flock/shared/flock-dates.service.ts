import { Injectable } from '@angular/core';
import { FlockService } from 'app/shared/service/flock.service';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { FlockInsertsService } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import 'rxjs/add/operator/switchMapTo';

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
            .do(r => console.log('sat2 - breedingPeriod', r));

        this.breedingDates = this.breedingPeriod
            .switchMapTo(this.flockInsertsService.startDate, (a, b): [any, any] => [a, b])
            .do(r => console.log('sat2 - breedingDates', r))
            .map(([breedingPeriod, startDate]) => Array
                .from({length: breedingPeriod + 1}, (v, i) => moment(startDate).add(i, 'days').toDate())
            );

    }

};
