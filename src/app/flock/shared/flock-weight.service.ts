import { Injectable } from '@angular/core';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';
import { FlockWeight } from '../../models/flock-weight.model';
import { MarketWeight } from 'app/models/market-weight.model';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketWeightService } from 'app/market/market-weight.service';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';
import * as laylow from '../../helpers/lcdash';
import * as moment from 'moment';
import { Flock } from 'app/models/flock.model';
import { FlockInsertsService } from './flock-inserts.service';
import { FlockInsert } from './flock-insert.model';
import { FlockQuantity } from '../../models/flock-quantity.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FlockBreedingService } from './flock-breeding.service';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';
import { FlockWeightDbService } from '../../shared/service/flock-weight-db.service';

import 'rxjs/add/operator/take';

@Injectable()
export class FlockWeightService {

    public collection: Observable<FlockWeight[]>;
    public currentWeight: Observable<number>;
    public update: Subject<FlockWeight> = new Subject();
    public remove: Subject<FlockWeight> = new Subject();
    public refresh: Subject<number> = new Subject();
    public currentDensity: Observable<number>;
    public marketWeight: Observable<MarketWeight[]>;

    constructor(
        private flockInsertsService: FlockInsertsService,
        private marketWeightService: MarketWeightService,
        private flockDatesService: FlockDatesService,
        private databaseService: DatabaseService,
        private flockWeightDB: FlockWeightDbService,
        private flockService: FlockService,
    ) {
        console.count('FlockWeightService constructor');

        this.marketWeight = this.flockService.currentFlock
            .take(1)
            .map(flock => flock.type)
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType));

        this.collection = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .flatMap(flockId => this.flockWeightDB.getByFlock(flockId));

        this.update
            .flatMap(flock => this.flockWeightDB.update(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

        this.remove
            .flatMap(flock => this.flockWeightDB.remove(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

    }

}
