import { Injectable } from '@angular/core';
import { FlockDecease } from '../../models/flock-decease.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketDeceaseRateService } from 'app/market/market-decease-rate.service';
import { MarketDeceaseRate } from '../../models/market-decease-rate.model';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';
import { FlockDeceaseDbService } from '../../shared/service/flock-decease-db.service';

import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';

@Injectable()
export class FlockDeceaseItemService {

    public collection: Observable<FlockDeceaseItem[]>;
    public update: Subject<FlockDeceaseItem> = new Subject();
    public refresh: Subject<number> = new Subject();
    public totalDeceased: Observable<number>;
    public marketDeceaseRates: Observable<MarketDeceaseRate[]>;

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private databaseService: DatabaseService,
        private flockService: FlockService,
        flockDecease: FlockDeceaseDbService
    ) {
        console.count('FlockDeceaseItemService constructor');

        this.marketDeceaseRates = this.flockService.currentFlockType
            .take(1)
            .do(() => console.log('flock deceases - marketDeceaseRates'))
            .flatMap(flockType => this.marketDeceaseRateService.getByFlockType(flockType.id));

        this.collection = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .flatMap(flockId => flockDecease.getByFlock(flockId));


        this.update
            .flatMap(flock => flockDecease.update(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

    }

}
