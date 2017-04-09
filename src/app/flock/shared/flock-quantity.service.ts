import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockInsertsService  } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as lcdash from '../../helpers/lcdash';
import * as _ from 'lodash';
import { FlockDeceaseService } from './flock-decease.service';

@Injectable()
export class FlockQuantityService {

    public quantity: Observable<FlockQuantity[]>;
    public currentQuantity: Observable<FlockQuantity>;

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
            .map(datesAndInserts => lcdash.mergeJoin(datesAndInserts, 'date', 'date', 'inserts', 'quantity'))
            .combineLatest(this.flockDeceaseService.flockDeceases)
            .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases', 'quantity'))
            // TODO add sales !
            // .combineLatest(this.flockSalesService)
            // .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases', 'quantity'))
            .map(items => {
                items.reduce((total, item) => {
                    item.total = total + item.inserts - item.deceases - item.sales;
                    return item.total;
                }, 0);
                return items;
            })
            .do(r => console.log('FlockQuantityService quantity', r[0]))
            .publishReplay(1)
            .refCount();

        this.currentQuantity = this.quantity
            .map(items => _.last(items));

    }
}

interface FlockQuantity {
    date: string;
    total: 0;
    inserts: 0;
    deceases: 0;
    sales: 0;
}
