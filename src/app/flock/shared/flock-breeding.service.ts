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
import * as laylow from '../../helpers/lcdash';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';


@Injectable()
export class FlockBreedingService {

    public breedingStore: Observable<FlockBreedingDate[]>;
    public currentBreedingDate: Observable<FlockBreedingDate>;

    private _breedingStore: ReplaySubject<FlockBreedingDate[]> = new ReplaySubject(1);

    private flockWeight: Observable<FlockWeight[]>;

    constructor(
        flock: FlockService,
        flockDates: FlockDatesService,
        flockWeightService: FlockWeightService,
        flockQuantity: FlockQuantityService,
        flockDecease: FlockDeceaseItemService
    ) {

        this.breedingStore = this._breedingStore.asObservable();

        this.currentBreedingDate = this.breedingStore
            .map(items => {
                items.reduce((prevItem, item) => {
                    item.weight =  item.weight || prevItem.weight || 0;
                    return item;
                }, {} as FlockBreedingDate)
                return items;
            })
            .map(items => items
                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day')))
            .map(items => _
                .maxBy(items, item => new Date(item.date).getTime()))
            .map(item => item || {} as FlockBreedingDate);

        flockDates.breedingDatesString
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
            .switchMapTo(flockDecease.collection, (dates, deceases) => laylow
                .mergeJoin([dates, deceases], 'date', 'deceaseDate', 'decease', 'quantity'))
            .switchMapTo(flockDecease.marketDeceaseRates, (dates, marketDeceaseRates) => laylow
                .mergeJoin([dates, marketDeceaseRates], 'day', 'day', 'marketDeceaseRate', 'rate'))
            .map(items => items
                .map(item => {
                    const weight = item.weight || item.marketWeight || 0;
                    item.totalWeight = weight * item.quantity.total;
                    return item;
                })
            )
            .map(items => {
                items.reduce((prevDecease, item) => {
                    const decease = item.decease || 0;
                    item.totalDecease = decease + prevDecease;
                    item.deceaseRate = item.totalDecease / item.quantity.totalInserts;
                    return item.totalDecease;
                }, 0);
                return items;
            })
            .map(items => {
                items.reduce((prevWeight, item) => {
                    const weight = item.weight || item.marketWeight || 0;
                    item.weightIncrement = (weight - prevWeight);
                    return weight;
                }, 0);
                return items;
            })
            .map(items => {
                items.reduce((prevWeightTotal, item) => {
                    item.totalWeightIncrement = (prevWeightTotal) ? Math.max(item.totalWeight - prevWeightTotal, 0) : 0;
                    return item.totalWeight;
                }, 0);
                return items;
            })
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

