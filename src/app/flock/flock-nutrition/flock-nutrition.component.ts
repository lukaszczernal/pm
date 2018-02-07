import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockDatesService } from '../shared/flock-dates.service';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockQuantityService } from '../shared/flock-quantity.service';
import { FlockWeightService } from '../shared/flock-weight.service';
import { MarketWeight } from '../../models/market-weight.model';
import { MarketWeightService } from '../../market/market-weight.service';
import { MarketConsumption } from '../../models/market-consumption.model';
import { MarketConsumptionService } from '../../market/market-consumption.service';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import * as lcdash from '../../helpers/lcdash';
import { Moment } from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FlockFodderService } from 'app/flock/shared/flock-fodder.service';
import { FlockQuantity } from 'app/models/flock-quantity.model';
import { FlockConsumption } from 'app/models/flock-consumption.model';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  templateUrl: './flock-nutrition.component.html',
  styleUrls: ['./flock-nutrition.component.scss']
})
export class FlockNutritionComponent implements OnInit {

    public displayedColumns: string[];
    public hasInserts: Observable<boolean>;
    public items: Observable<MatTableDataSource<any>>;

    marketConsumption: Observable<MarketConsumption[]>;
    marketWeight: Observable<MarketWeight[]>;

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
        private flockService: FlockService
    ) { }

   ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'weight', 'fcr', 'totalFcr', 'fodderTotalQty', 'fodderPurchaseQty', 'actions'];

        this.hasInserts = this.flockInsertsService.hasInserts;

        this.marketConsumption = this.flockService.currentFlockType
            .do(() => console.log('flock nutrition list - marketConsumption'))
            .flatMap(flockType => this.marketConsumptionService.getByFlockType(flockType.id));

        this.marketWeight = this.flockService.currentFlockType
            .do(() => console.log('flock nutrition list - marketWeight'))
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType.id));

        this.items = this.flockDatesService.breedingDates
            .map(dates => dates
                .map((date, day) => new FlockConsumption({date, day}))
            )
            .combineLatest(this.flockWeightService.weights)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'weight'))
            .combineLatest(this.flockFodderService.foddersMergedByDate)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderPurchaseQty', 'quantity'))
            .combineLatest(this.marketWeight)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'marketWeight', 'value'))
            .combineLatest(this.flockQuantityService.quantity)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'quantity'))
            .combineLatest(this.marketConsumption)
            .map(data => lcdash.mergeJoin(data, 'day', 'day', 'fcr', 'fcr'))
            .combineLatest(this.flockFodderQuantityService.quantityByDate)
            .map(data => lcdash.mergeJoin(data, 'date', 'date', 'fodderTotalQty', 'fodderQuantity'))
            .do(r => console.log('NutritionComponent list', r[0]))
            .map(items => new MatTableDataSource(items));

    }

};
