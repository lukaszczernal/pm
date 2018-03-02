import { Injectable } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockInsertsService  } from './flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import * as lcdash from '../../helpers/lcdash';
import { FlockQuantity } from 'app/models/flock-quantity.model';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { FlockSalesService } from './flock-sales.service';
import { FlockSales } from '../../models/flock-sales.model';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';

import 'rxjs/add/operator/take';

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
            .take(1)
            .switchMapTo(this.flockInsertsService.insertsByDate,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
            .map(datesAndInserts => lcdash.mergeJoin(datesAndInserts, 'date', 'date', 'inserts', 'quantity'))
            .switchMapTo(this.flockDeceaseItemService.collection,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
            .map(datesAndDeceases => lcdash.mergeJoin(datesAndDeceases, 'date', 'deceaseDate', 'deceases', 'quantity'))
            .switchMapTo(this.flockSalesService.items,  (dates, items): [FlockQuantity[], any[]] => [dates, items])
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
            });

    }
}
