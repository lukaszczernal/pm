import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockInsertsService  } from './flock-inserts.service';
import { Observable } from 'rxjs';
import * as lcdash from '../../helpers/lcdash';
import { FlockDeceaseService } from './flock-decease.service';

@Injectable()
export class FlockQuantityService {

    public quantity: Observable<any>;

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockDeceaseService: FlockDeceaseService,
        private flockDatesService: FlockDatesService,
        private flockService: FlockService
    ) {
        console.count('FlockQuantityService constructor');

        this.quantity = this.flockDatesService.breedingDatesString
            .map(dates => dates
                .map(date => {
                    return {
                        date: date,
                        total: 0,
                        inserts: 0,
                        deceases: 0,
                        sales: 0
                    } as FlockQuantity;
                })
            )
            .combineLatest(this.flockInsertsService.insertsByDate)
            .map(datesAndInserts => lcdash.mergeJoin(datesAndInserts, 'date', 'date', 'inserts'))
            .combineLatest(this.flockDeceaseService.flockDeceases)
            .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases'))
            .map(dates => dates
                .map((item, index, items) => {
                    let total = items[index - 1] && items[index - 1].total || 0;
                    item.total = total + item.inserts - item.deceases - item.sales;
                    return item;
                })
            )
            .do(r => console.log('FlockQuantityService quantity', r[0]))
            .publishReplay(1)
            .refCount();

    }
}

interface FlockQuantity {
    date: string;
    total: 0;
    inserts: 0;
    deceases: 0;
    sales: 0;
}