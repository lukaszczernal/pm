import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { FlockWeightService } from 'app/flock/shared/flock-weight.service';
import * as lcdash from '../../helpers/lcdash';
import { FlockFodderService } from 'app/flock/shared/flock-fodder.service';
import { Observable } from 'rxjs/Observable';
import { BaseModel } from 'app/shared/base.model';
import { FlockService } from 'app/flock/flock.service';
import { MarketConsumptionService } from 'app/market/market-consumption.service';
import { MarketConsumption } from 'app/models/market-consumption.model';
import * as moment from 'moment';

@Injectable()
export class FlockFodderQuantityService {

    private marketConsumption: Observable<MarketConsumption[]>;

    currentFodderQuantity: Observable<number>;
    quantityByDate: Observable<FlockFodderQuantity[]>;

    constructor(
        private marketConsumptionService: MarketConsumptionService,
        private flockWeightService: FlockWeightService,
        private flockFodderService: FlockFodderService,
        private flockDatesService: FlockDatesService,
        private flockService: FlockService
    ) {

        this.marketConsumption = this.flockService.currentFlockType
            .do(() => console.log('FlockFodderQuantityService - marketConsumption'))
            .flatMap(flockType => this.marketConsumptionService.getByFlockType(flockType.id));

        this.quantityByDate = this.flockDatesService.breedingDates
            .map(dates => dates
                .map((date, day) => new FlockFodderQuantity({date, day}))
            )
            .combineLatest(this.flockWeightService.weights)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'flockWeightIncrement', 'incrementTotal'))
            .combineLatest(this.flockFodderService.foddersMergedByDate)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderPurchase', 'quantity'))
            .combineLatest(this.marketConsumption)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'fcr', 'fcr'))
            .map(items => {
                items.reduce((fodder, item) => {
                    item.fodderQuantity = Math.max(item.fodderPurchase + fodder - (item.flockWeightIncrement * item.fcr), 0);
                    return item.fodderQuantity;
                }, 0);
                return items;
            })
            .do(r => console.log('FlockFodderQuantityService quantities', r[0]));

        this.currentFodderQuantity = this.quantityByDate
            .map(items => items
                .find(item => moment(item.date).isSame(moment(), 'day')))
            .map(item => (item && item.fodderQuantity) || 0);

    }

}

export class FlockFodderQuantity extends BaseModel {

    day: number;
    date: Date;
    fcr: number;
    fodderQuantity = 0;
    fodderPurchase = 0;
    flockWeightIncrement: 0;

    constructor(data) {
        super(data);
        this.day = data.day + 1;
    }

}






