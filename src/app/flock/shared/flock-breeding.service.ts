import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockWeightService } from './flock-weight.service';
import { FlockWeight } from '../../models/flock-weight.model';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';
import { FlockQuantity } from '../../models/flock-quantity.model';
import { FlockDeceaseItemService } from './flock-decease-item.service';
import { FlockFodderService } from './flock-fodder.service';
import * as laylow from '../../helpers/lcdash';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/observable/combineLatest';
import { FlockInsertsService } from './flock-inserts.service';
import { FlockSalesService } from './flock-sales.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FlockBreedingService {

    public breedingStore: Observable<FlockBreedingDate[]>;
    public currentBreedingDate: Observable<FlockBreedingDate>;
    public fcr: Observable<number>;
    public eww: Observable<number>;

    private flockWeight: Observable<FlockWeight[]>;

    constructor(
        flock: FlockService,
        flockDates: FlockDatesService,
        flockWeight: FlockWeightService,
        flockDecease: FlockDeceaseItemService,
        flockFodder: FlockFodderService,
        flockInserts: FlockInsertsService,
        flockSales: FlockSalesService
    ) {

        this.breedingStore = flockDates.breedingDates
            .map(dates => dates
                .map((date, day) =>
                    new FlockBreedingDate({date, day}))
            )
            .switchMapTo(flockWeight.collection, (dates, items) => laylow
                .mergeJoin([dates, items], 'date', 'date', 'weight', 'value'))
            .switchMapTo(flockWeight.marketWeight, (dates, items) => laylow
                .mergeJoin([dates, items], 'day', 'day', 'marketWeight', 'value'))
            .switchMapTo(flockDecease.marketDeceaseRates, (dates, items) => laylow
                .mergeJoin([dates, items], 'day', 'day', 'marketDeceaseRate', 'rate'))
            .switchMapTo(flockFodder.foddersMergedByDate, (dates, items) => laylow
                .mergeJoin([dates, items], 'date', 'date', 'fodderPurchase', 'quantity'))
            .switchMapTo(flockFodder.marketConsumption, (dates, items) => laylow
                .mergeJoin([dates, items], 'day', 'day', 'fcr', 'fcr'))
            .switchMapTo(flockInserts.insertsByDate, (dates, items) => laylow
                .mergeJoin([dates, items], 'date', 'date', 'inserts', 'quantity'))
            .switchMapTo(flockDecease.collection, (dates, items) => laylow
                .mergeJoin([dates, items], 'date', 'date', 'deceases', 'value'))
            .switchMapTo(flockSales.items, (dates, items) => laylow
                .mergeJoin([dates, items], 'date', 'date', 'sales', 'quantity'))
            .map(items => {
                items.reduce((prevItem, item) => {
                    item.totalInserts = prevItem.totalInserts + (item.inserts || 0);
                    item.quantity = prevItem.quantity + (item.inserts || 0) - (item.deceases || 0) - (item.sales || 0);
                    return item;
                }, { totalInserts: 0, quantity: 0 });
                return items;
            })
            .map(items => items
                .map(item => {
                    item.predictedWeight = item.weight || item.marketWeight || 0;
                    item.totalPredictedWeight = item.predictedWeight * item.quantity;
                    item.totalDecease = item.deceases || 0;
                    item.deceaseRate = (item.totalDecease / item.totalInserts) || 0;
                    item.fcr = item.fcr || 0;
                    item.fodderPurchase = item.fodderPurchase || 0;
                    item.totalWeight = (item.weight || 0) * item.quantity;
                    item.fodderQuantity = item.fodderPurchase || 0;
                    return item;
                })
            )
            .map(items => {
                items.reduce((prevItem, item) => {
                    item.totalWeight = item.totalWeight || prevItem.totalWeight;
                    item.predictedWeight = Math.max(item.predictedWeight, prevItem.predictedWeight)
                    item.totalPredictedWeight = Math.max(item.totalPredictedWeight, prevItem.totalPredictedWeight);
                    item.predictedWeightIncrement = Math.max(item.predictedWeight - prevItem.predictedWeight, 0);
                    item.totalWeightIncrement = Math.max(item.totalWeight - prevItem.totalWeight, 0);
                    item.totalPredictedWeightIncrement = Math.max(item.totalPredictedWeight - prevItem.totalPredictedWeight, 0);
                    item.totalDecease = prevItem.totalDecease + (item.deceases || 0);
                    item.deceaseRate = item.totalDecease / item.totalInserts;
                    item.fodderQuantity = Math
                        .max(prevItem.fodderQuantity + item.fodderPurchase - (item.totalPredictedWeightIncrement * item.fcr), 0);
                    return item;
                });
                return items;
            })
            // TODO it only works because breeding dates are calculated based on current flock type
            // TODO breeding dates should not relay on currentFlock (only on currentFlockId)
            .withLatestFrom(flock.currentFlock)
            .map(([items, currentFlock]) => items
                .map(item => {
                    item.density = item.totalWeight / currentFlock.coopSize;
                    return item;
                })
            )
            .publishReplay(1)
            .refCount();

        this.currentBreedingDate = this.breedingStore
            .map(items => _.cloneDeep(items)) // TODO immutable.js
            .map(items => {
                items.reduce((prevItem, item) => {
                    item.weight = item.weight || prevItem.weight || 0;
                    return item;
                }, {} as FlockBreedingDate)
                return items;
            })
            .withLatestFrom(flock.currentFlock, (items, currentFlock) => {
                const endDate = currentFlock.closeDate || new Date();
                return items
                    .filter(item => moment(item.date).isSameOrBefore(endDate, 'day'));
            })
            .map(items => _
                .maxBy(items, item => new Date(item.date).getTime()))
            .filter(item => Boolean(item))

        this.fcr = Observable.combineLatest(
            this.currentBreedingDate,
            flockFodder.totalFodderConsumption,
            (date, totalFodderConsumption) => {
                return totalFodderConsumption / date.totalWeight;
            })
            .publishReplay(1)
            .refCount();

        this.eww = this.fcr
            .withLatestFrom(this.currentBreedingDate, (fcr, date) => {
                return ((1 - date.deceaseRate) * 100 * date.weight) / (fcr * date.day) * 100;
            });

    }

}

