import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../flock.service';
import { FlockDatesService } from './flock-dates.service';
import { FlockWeightService } from './flock-weight.service';
import { FlockWeight } from '../../models/flock-weight.model';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';
import { FlockQuantity } from '../../models/flock-quantity.model';
import { FlockQuantityService } from './flock-quantity.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockDeceaseItemService } from './flock-decease-item.service';
import { FlockFodderService } from './flock-fodder.service';
import * as laylow from '../../helpers/lcdash';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';


@Injectable()
export class FlockBreedingService {

    public breedingStore: Observable<FlockBreedingDate[]>;
    public currentBreedingDate: Observable<FlockBreedingDate>;
    public fcr: Observable<number>;

    private _breedingStore: ReplaySubject<FlockBreedingDate[]> = new ReplaySubject(1);

    private flockWeight: Observable<FlockWeight[]>;

    constructor(
        flock: FlockService,
        flockDates: FlockDatesService,
        flockWeightService: FlockWeightService,
        flockQuantity: FlockQuantityService,
        flockDecease: FlockDeceaseItemService,
        flockFodder: FlockFodderService,
    ) {

        this.breedingStore = this._breedingStore.asObservable();

        this.currentBreedingDate = this.breedingStore
            .map(items => _.cloneDeep(items)) // TODO immutable.js
            .map(items => {
                items.reduce((prevItem, item) => {
                    item.weight = item.weight || prevItem.weight || 0;
                    return item;
                }, {} as FlockBreedingDate)
                return items;
            })
            .map(items => items
                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day')))
            .map(items => _
                .maxBy(items, item => new Date(item.date).getTime()))
            .map(item => item || {} as FlockBreedingDate);

        this.fcr = this.currentBreedingDate
            .switchMapTo(flockFodder.totalFodderConsumption, (date, totalFodderConsumption) => {
                return totalFodderConsumption / date.totalWeight;
            });

        flockDates.breedingDates
            .map(dates => dates
                .map((date, day) =>
                    new FlockBreedingDate({date, day}))
            )
            .switchMapTo(flockWeightService.collection, (dates, weights) => laylow
                .mergeJoin([dates, weights], 'date', 'date', 'weight', 'value'))
            .switchMapTo(flockWeightService.marketWeight, (dates, marketWeights) => laylow
                .mergeJoin([dates, marketWeights], 'day', 'day', 'marketWeight', 'value'))
            .switchMapTo(flockQuantity.quantity, (dates, quantity) => laylow
                .replaceJoin([dates, quantity], 'date', 'date', 'quantity'))
            .switchMapTo(flockDecease.marketDeceaseRates, (dates, marketDeceaseRates) => laylow
                .mergeJoin([dates, marketDeceaseRates], 'day', 'day', 'marketDeceaseRate', 'rate'))
            .switchMapTo(flockFodder.foddersMergedByDate, (dates, fodder) => laylow
                .mergeJoin([dates, fodder], 'date', 'date', 'fodderPurchase', 'quantity'))
            .switchMapTo(flockFodder.marketConsumption, (dates, fodder) => laylow
                .mergeJoin([dates, fodder], 'day', 'day', 'fcr', 'fcr'))
            .map(items => items
                .map(item => {
                    item.predictedWeight = item.weight || item.marketWeight || 0;
                    item.totalPredictedWeight = item.predictedWeight * item.quantity.total;
                    item.totalDecease = item.quantity.deceases || 0;
                    item.deceaseRate = (item.totalDecease / item.quantity.totalInserts) || 0;
                    item.fcr = item.fcr || 0;
                    item.fodderPurchase = item.fodderPurchase || 0;
                    item.totalWeight = (item.weight || 0) * item.quantity.total;
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
                    item.totalDecease = prevItem.totalDecease + (item.quantity.deceases || 0);
                    item.deceaseRate = item.totalDecease / item.quantity.totalInserts;
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
            .subscribe(this._breedingStore);

    }

}

