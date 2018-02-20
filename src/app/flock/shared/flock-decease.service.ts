import { Injectable } from '@angular/core';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { FlockDecease } from 'app/models/flock-decease.model';
import * as _ from 'lodash';
import * as laylow from 'app/helpers/lcdash';
import * as moment from 'moment';
import { MarketDeceaseRateService } from 'app/market/market-decease-rate.service';
import { MarketDeceaseRate } from 'app/models/market-decease-rate.model';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';

import 'rxjs/add/operator/switchMapTo';
import { FlockQuantity } from '../../models/flock-quantity.model';

@Injectable()
export class FlockDeceaseService {

    public deceases: Observable<FlockDecease[]>;
    public currentDecease: Observable<FlockDecease>;
    public deceasesByweeks: Observable<FlockDecease[]>;

    private _flockDeceases: ReplaySubject<FlockDecease[]> = new ReplaySubject(1);
    private marketDeceaseRates: Observable<MarketDeceaseRate[]>;

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private flockDeceaseItemService: FlockDeceaseItemService,
        private flockQuantityService: FlockQuantityService,
        private flockDatesService: FlockDatesService,
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockDeceaseService constructor');

        this.marketDeceaseRates = this.flockService.currentFlockType
            .do(() => console.log('flock decease list - marketDeceaseRates'))
            .flatMap(flockType => this.marketDeceaseRateService.getByFlockType(flockType.id));

        this.deceases = this.flockDatesService.breedingDatesString
            .map(dates => dates
                .map((date, day) =>
                    new FlockDecease({date, day}))
            )
            .switchMapTo(this.flockDeceaseItemService.collection,  (dates, items): [FlockDecease[], FlockDeceaseItem[]] => [dates, items])
            .do(r => console.log('!flockDeceases 1', r))
            .map(data => laylow.mergeJoin(data, 'date', 'deceaseDate', 'deceaseItem'))
            .withLatestFrom(this.marketDeceaseRates)
            .do(r => console.log('!flockDeceases 2', r))
            .map(data => laylow.mergeJoin(data, 'day', 'day', 'marketDeceaseRate', 'rate'))
            .switchMapTo(this.flockQuantityService.quantity, (dates, items): [FlockDecease[], FlockQuantity[]] => [dates, items])
            .do(r => console.log('!flockDeceases 3', r))
            .map(data => laylow.replaceJoin(data, 'date', 'date', 'flockQuantity'))
            .withLatestFrom(this.flockService.currentFlockId, (items, flockId): [FlockDecease[], number] => [items, flockId])
            .do(r => console.log('!flockDeceases 3', r))
            .map(([items, flockId]) => items
                .map(item => {
                    item.deceaseItem = item.deceaseItem ? item.deceaseItem : new FlockDeceaseItem({
                        deceaseDate: new Date(item.date),
                        quantity: 0,
                        flock: flockId
                    } as FlockDeceaseItem);
                    item.decease = item.deceaseItem.quantity;
                    return item;
                })
            )
            .map(items => {
                items.reduce((prevDecease, item) => {
                    const decease = item.decease || 0;
                    item.deceaseTotal = decease + prevDecease;
                    return item.deceaseTotal;
                }, 0);
                return items;
            })
            .map(items => items
                .map(item => {
                    item.deceaseRate = item.deceaseTotal / item.flockQuantity.totalInserts;
                    return item;
                })
            )
            .do(r => console.log('!flockDeceases 4', r))
            .publishReplay(1)
            .refCount();

        this.deceasesByweeks = this.deceases
            .map(items => items
                .filter(item => item.isLastWeekDay));

        this.currentDecease = this.deceases
            .map(items => items[items.length - 1])
            .map(item => item || {} as FlockDecease);

    }

}
