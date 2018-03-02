import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { FlockInsertsService } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/switchMapTo';

@Injectable()
export class FlockDatesService {

    public breedingPeriod: Observable<number>;
    public breedingDates: Observable<Date[]>;
    public breedingDatesString: Observable<string[]>;
    // public breedingDatesTimestamp: Observable<string[]>;

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

        // TODO consider using timestamp instead DateStrings below
        // this.breedingDatesTimestamp = this.breedingDates
        //     .do(r => console.log('sat2 - breedingDatesString', r[0]))
        //     .map(dates => dates
        //         .map(date => date.getTime().toString())
        //     )
        //     .share();

        this.breedingDatesString = this.breedingDates
            .do(r => console.log('sat2 - breedingDatesString', r[0]))
            .map(dates => dates
                .map(date => date.toString())
            );

    }

};
