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
import { FlockTypeService } from '../../farm/shared/flock-type.service';
import * as lcdash from '../../helpers/lcdash';
import { Moment } from 'moment';
import { Subscription, Observable } from 'rxjs';
import { FlockFodderService } from 'app/flock/shared/flock-fodder.service';
import { FlockQuantity } from 'app/models/flock-quantity.model';
import { FlockConsumption } from 'app/models/flock-consumption.model';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit, OnDestroy {

    hasInserts = false;
    items: any[] = [];
    marketConsumption: Observable<MarketConsumption[]>;
    marketWeight: Observable<MarketWeight[]>;

    private listSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private flockFodderQuantityService: FlockFodderQuantityService,
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

        this.listSub = this.flockDatesService.breedingDates
            .map(dates => dates
                .map((date, day) => new FlockConsumption({date, day}))
            )
            .combineLatest(this.flockWeightService.weights)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'weight'))
            .combineLatest(this.flockFodderService.fodders)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderPurchase', 'quantity'))
            .combineLatest(this.marketWeight)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'marketWeight', 'value'))
            .combineLatest(this.flockQuantityService.quantity)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'quantity'))
            .combineLatest(this.marketConsumption)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'fcr', 'fcr'))
            .combineLatest(this.flockFodderQuantityService.quantityByDate)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderQuantity', 'fodderQuantity'))
            .do(r => console.log('NutritionComponent list', r[0]))
            .subscribe(items => this.zone.run(() =>
                this.items = items)
            );

    }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

};
