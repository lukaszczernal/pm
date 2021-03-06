import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlockService } from 'app/shared/service/flock.service';
import { FlockInsertsService } from '../shared/flock-inserts.service';
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
import { FlockConsumption } from 'app/models/flock-consumption.model';
import { MatTableDataSource } from '@angular/material';
import { FlockBreedingService } from '../shared/flock-breeding.service';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';

@Component({
  templateUrl: './flock-nutrition.component.html',
  styleUrls: ['./flock-nutrition.component.scss']
})
export class FlockNutritionComponent implements OnInit {

    public displayedColumns: string[];
    public hasInserts: Observable<boolean>;
    public items: Observable<MatTableDataSource<FlockBreedingDate>>;

    marketConsumption: Observable<MarketConsumption[]>;
    marketWeight: Observable<MarketWeight[]>;

    constructor(
        private marketConsumptionService: MarketConsumptionService,
        private marketWeightService: MarketWeightService,
        private flockInsertsService: FlockInsertsService,
        private flockFodderService: FlockFodderService,
        private flockTypeService: FlockTypeService,
        private flockBreeding: FlockBreedingService,
        private flockService: FlockService
    ) { }

   ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'weight', 'fcr', 'totalFcr', 'fodderTotalQty', 'fodderPurchaseQty', 'actions'];

        this.hasInserts = this.flockInsertsService.hasInserts;

        this.items = this.flockBreeding.breedingStore
            .map(items => new MatTableDataSource(items));

    }

};
