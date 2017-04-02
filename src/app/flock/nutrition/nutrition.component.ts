import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from '../shared/flock-dates.service';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockQuantityService } from '../shared/flock-quantity.service';
import { FlockWeightService } from '../shared/flock-weight.service';
import { MarketWeight } from '../../models/market-weight.model';
import { MarketWeightService } from '../../market/market-weight.service';
import { MarketConsumption } from '../../models/market-consumption.model';
import { MarketConsumptionService } from '../../market/market-consumption.service';
// import { FlockInsert } from '../shared/flock-insert.model';
import { FlockTypeService } from '../../farm/shared/flock-type.service';
// import { FlockWeight } from '../../models/flock-weight.model';
// import * as moment from 'moment';
// import * as _ from 'lodash';
import * as lcdash from '../../helpers/lcdash';
import { Moment } from 'moment';
import { Subscription, Observable } from 'rxjs';
import { FlockFodderService } from 'app/flock/shared/flock-fodder.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit, OnDestroy {

    hasInserts: boolean = false;
    items: any[] = [];
    marketConsumption: Observable<MarketConsumption[]>;
    marketWeight: Observable<MarketWeight[]>;

    // private breedingPeriod: Observable<number>;
    // private dayRange: Observable<number[]>;

    private listSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private marketConsumptionService: MarketConsumptionService,
        private flockQuantityService: FlockQuantityService,
        private marketWeightService: MarketWeightService,
        private flockInsertsService: FlockInsertsService,
        private flockWeightService: FlockWeightService,
        private flockFodderService: FlockFodderService,
        private flockTypeService: FlockTypeService,
        private flockDatesService: FlockDatesService,
        private flockService: FlockService,
        private zone: NgZone
    ) { }

   ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.hasInsertsSub = this.flockInsertsService.hasInserts
            .do(() => console.log('flock nutrition list - hasinserts'))
            .subscribe(hasInserts => this.hasInserts = hasInserts);


        this.marketConsumption = this.flockService.currentFlockType
            .do(() => console.log('flock nutrition list - marketConsumption'))
            .flatMap(flockType => this.marketConsumptionService.getByFlockType(flockType.id));

        this.marketWeight = this.flockService.currentFlockType
            .do(() => console.log('flock nutrition list - marketWeight'))
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType.id));

        // this.startDate = this.flockInsertsService.startDate
        //     .map(startDate => moment(startDate))
        //     .publishReplay(1)
        //     .refCount();

        // this.breedingPeriod = this.flockService.currentFlockType
        //     .map(flockType => flockType.breedingPeriod);

        // this.dayRange = this.breedingPeriod
        //     .first()
        //     .flatMap(breedingPeriod => Observable.range(1, breedingPeriod))
        //     .toArray();

        this.listSub = this.flockDatesService.breedingDates
            .map(dates => dates
                .map((date, index) => {
                    return {
                        day: index + 1,
                        date: date,
                        weight: 0,
                        marketWeight: 0,
                        totalWeight: 0,
                        totalWeightIncrease: 0,
                        quantity: 0,
                        fcr: 0,
                        fodder: 0,
                        fodderPurchase: 0
                    } as FlockNutritionRow;
                }))
            .combineLatest(this.flockWeightService.collection)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'weight', 'value'))
            .combineLatest(this.flockFodderService.fodderPurchaseByDate)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderPurchase', 'quantity'))
            .combineLatest(this.marketWeight)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'marketWeight', 'value'))
            .combineLatest(this.flockQuantityService.quantity)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'quantity'))
            .combineLatest(this.marketConsumption)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'fcr', 'fcr'))
            .map(items => items
                .map(item => {
                    const weight = item.weight || item.marketWeight;
                    item.totalWeight = weight * item.quantity.total;
                    return item;
                }))
            .map(items => {
                items.reduce((weight, item, index, _items) => {
                    item.totalWeightIncrease = item.totalWeight - weight;
                    return item.totalWeightIncrease;
                }, 0);
                return items;
            })
            .map(items => {
                items.reduce((fodder, item, index, _items) => {
                    // console.log(item.fodder, fodder, (item.totalWeightIncrease * item.fcr));
                    item.fodder = Math.max(item.fodderPurchase + fodder - (item.totalWeightIncrease * item.fcr), 0);
                    return item.fodder;
                }, 0);
                return items;
            })
            .do(r => console.log('NutritionComponent list', r[0]))
            // .combineLatest(this.flockWeightService.collection, (dates, weights): [any[], FlockWeight[]] => [dates, weights])
            // .map(([dates, weights]) => _.un
            //     .map(date => {
            //         date.weight = weights.find(_weight => moment(_weight.date).isSame(date.date, 'day'));
            //         return date;
            //     }))
            // .combineLatest(this.flockInsertsService.flockInserts, (rows, inserts) => rows
            //     .map(row => {
            //         let insert = inserts.find(_insert => moment(_insert.date).isSame(row.date, 'day')) || {} as FlockInsert;
            //         row.insert = insert.quantity || 0;
            //         return row;
            //     })
            // )

            // .map(([, date, flockId]) => {
            //         date.add(1, 'days');
            //         return {
            //             id: flockId,
            //             day: day,
            //             date: date.toDate()
            //         };
            //     }
            // )
            // .map(day => {return {'day': day}; })
        //     .combineLatest(
        //         this.flockInsertsService.startDate,
        //         this.flockWeightService.collection,
        //         this.flockService.currentFlockId,
        //          (flockType, startDate, weight, flockId) => [
        //              flockType.breedingPeriod, startDate, weight, flockId])
            // .map(([growthDayTotal, startDate, weights, flockId]: [
        //         number, Date, FlockWeight[], number]) => {
        //         let day = 1;
        //         let date = moment(startDate);
        //         let weight: FlockWeight;
        //         let items = [];

        //         while (growthDayTotal--) {
        //             weight = weights
        //                 .find(row => moment(row.date).isSame(date, 'day'));

        //             weight = weight || {
        //                 date: date.toDate(),
        //                 flock: flockId
        //             } as FlockWeight;

        //             items.push({
        //                 day: day,
        //                 date: date,
        //                 weight: weight,
        //                 marketWeight: 0,
        //                 isLastWeekDay: (day % 7) === 0
        //             });

        //             // Increments
        //             day++;
        //             date.add(1, 'day');
        //         }

        //         return items;
        //     })
        //     .combineLatest(this.marketWeight, (list, marketWeights) => list
        //         .map(item => {
        //             let _marketWeight = marketWeights.find(market => market.day === item.day) || {} as MarketWeight;
        //             item.marketWeight = _marketWeight.value || item.marketWeight;
        //             return item;
        //         })
        //     )
        //     .do(items => console.log('items', items))
            // .reduce((acc, item) => {
            //     console.log('item', item);
            //     acc.push(item);
            //     return acc;
            // }, [])
            .subscribe(items => {
                this.zone.run(() => this.items = items);
                // console.log('items', items);
            });

    }

    // onItemChange(form) {
    //     if (form.dirty) {
    //         let item = new FlockWeight(form.value);
    //         this.flockWeightService.update.next(item);
    //     }
    // }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

}

interface FlockNutritionRow {
    day: number;
    date: Date;
    weight: number;
    marketWeight: number;
    totalWeight: number;
    totalWeightIncrease: number;
    quantity: number;
    fcr: number;
    fodder: number;
    fodderPurchase: number;
};

