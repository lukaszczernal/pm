import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockInsertsService  } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as lcdash from '../../helpers/lcdash';
import * as _ from 'lodash';
import { FlockQuantity } from 'app/models/flock-quantity.model';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { Flock } from 'app/models/flock.model';
import { FlockSalesService } from './flock-sales.service';

@Injectable()
export class FlockQuantityService {

    public quantity: Observable<FlockQuantity[]>;
    public currentQuantity: Observable<FlockQuantity>;

    constructor(
        private flockDeceaseItemService: FlockDeceaseItemService,
        private flockInsertsService: FlockInsertsService,
        private flockDatesService: FlockDatesService,
        private flockSalesService: FlockSalesService,
        private flockService: FlockService
    ) {
        console.count('FlockQuantityService constructor');

        this.quantity = this.flockDatesService.breedingDatesString
            .map(dates => dates
                .map(date => new FlockQuantity({date}))
            )
            .combineLatest(this.flockInsertsService.insertsByDate)
            .map(datesAndInserts => lcdash.mergeJoin(datesAndInserts, 'date', 'date', 'inserts', 'quantity'))
            .combineLatest(this.flockDeceaseItemService.collection)
            .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases', 'quantity'))
            .combineLatest(this.flockSalesService.items)
            .map(datesAndSales => lcdash.mergeJoin(datesAndSales, 'date', 'date', 'sales', 'quantity'))
            .map(items => {
                items.reduce((total, item) => {
                    item.totalInserts = total + item.inserts;
                    return item.totalInserts;
                }, 0);
                return items;
            })
            .map(items => {
                items.reduce((total, item) => {
                    item.total = total + item.inserts - item.deceases - item.sales;
                    return item.total;
                }, 0);
                return items;
            })
            .combineLatest(this.flockService.currentFlock, (qty, flock): [FlockQuantity[], Flock] => [qty, flock])
            .map(([items, flock]) => items
                .map(item => {
                    item.density = item.total / flock.coopSize;
                    return item;
                })
            )
            .do(r => console.log('FlockQuantityService quantity', r[0]))
            .publishReplay(1)
            .refCount();

        this.currentQuantity = this.quantity // TODO I should match current date and not take last item
            .map(items => _.last(items));

    }
}
