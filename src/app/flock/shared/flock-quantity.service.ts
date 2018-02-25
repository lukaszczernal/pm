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
import { FlockSales } from '../../models/flock-sales.model';

import { FlockDeceaseItem } from '../../models/flock-decease-item.model';

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
            .do(r => console.log('sat-quantity 1 breedingDatesString', r.length))
            .switchMapTo(this.flockInsertsService.insertsByDate,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
            .do(r => console.log('sat-quantity 2 insertsByDate', r))
            .map(datesAndInserts => lcdash.mergeJoin(datesAndInserts, 'date', 'date', 'inserts', 'quantity'))
            .switchMapTo(this.flockDeceaseItemService.collection,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
            .do(r => console.log('sat-quantity 3 decease', r))
            .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases', 'quantity'))
            .switchMapTo(this.flockSalesService.items,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
            .do(r => console.log('sat-quantity 4 sales', r))
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
            .withLatestFrom(this.flockService.currentFlock, (qty, flock): [FlockQuantity[], Flock] => [qty, flock])
            .do(r => console.log('sat-quantity 5 currentFlock', r))
            .map(([items, flock]) => items
                .map(item => {
                    item.density = item.total / flock.coopSize;
                    return item;
                })
            )
            .do(r => console.log('sat-quantity 6 flockQuantity', r[0]));

        this.currentQuantity = this.quantity // TODO I should match current date and not take last item
            .map(items => _.last(items))
            .do(r => console.log('sat-quantity currentQuantity', r));

    }
}
