import { Component, OnInit } from '@angular/core';
import { FlockService } from '../../flock.service';
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockTypeService } from '../../../farm/shared/flock-type.service';
import { FlockDecease } from '../flock-decease.model';
import * as moment from 'moment';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit {

    hasInserts: boolean = false;
    days: FlockDecease[] = [];

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService
    ) { }

    ngOnInit() {

        this.flockInsertsService.hasInserts
            .subscribe(hasInserts => this.hasInserts = hasInserts);

        this.flockService.currentFlockType
            .combineLatest(this.flockInsertsService.startDate, (flockType, startDate) => [flockType.breedingPeriod, startDate])
            .map(([growthDayTotal, startDate]: [number, Date]) => {
                let date = moment(startDate);
                let day = 1;
                let i = 1000;
                let dates = [];
                while (growthDayTotal--) {
                    dates.push({
                        ordinal: day++,
                        date: date.add(1, 'day').toDate(),
                        quantity: i--
                    });
                }
                return dates;
            })
            .do(dates => console.log('dates', dates))
            .subscribe(dates => this.days = dates);

    }

}
