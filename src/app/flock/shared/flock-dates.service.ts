import { Injectable } from '@angular/core';
import { FlockService } from 'app/shared/service/flock.service';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { FlockInsertsService } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import 'rxjs/add/operator/switchMapTo';
import { Flock } from '../../models/flock.model';

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

        this.breedingPeriod = this.flockService.currentFlock
            .flatMap(flock => this.getBreedingPeriod(flock));

        this.breedingDates = this.breedingPeriod
            .switchMapTo(this.flockInsertsService.startDate, this.calculateDates);

    }

    getBreedingPeriod(flock: Flock): Observable<number> {
        if (flock.closeDate) {
            return this.flockInsertsService.getStartDate(flock.id)
                .map(startDate => this.calculateBreedingPeriod(startDate, flock.closeDate));
        } else {
            return this.flockService.getFlockType(flock)
                .map(flockType => flockType.breedingPeriod);
        }
    }

    private calculateBreedingPeriod(startDate, endDate): number {
        return moment(endDate).diff(startDate, 'days');
    }

    private calculateDates(breedingPeriod, startDate) {
        return Array.from(
            {length: breedingPeriod + 1},
            (v, i) => moment(startDate).add(i, 'days').toDate()
        )
    }

};
