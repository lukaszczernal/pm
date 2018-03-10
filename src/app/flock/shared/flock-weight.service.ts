import { Injectable } from '@angular/core';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';
import { FlockWeight } from '../../models/flock-weight.model';
import { MarketWeight } from 'app/models/market-weight.model';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketWeightService } from 'app/market/market-weight.service';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
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
        private flockService: FlockService
    ) {
        console.count('FlockWeightService constructor');

        this.marketWeight = this.flockService.currentFlock
            .take(1)
            .map(flock => flock.type)
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType));

        this.collection = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .flatMap(flockId => this.getByFlock(flockId));

        this.update
            .flatMap(flock => this.updateDB(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

        this.remove
            .flatMap(flock => this.removeDB(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

    }

    getByFlock(flockId: number): Observable<FlockWeight[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => query.exec())
            .map((collection: FlockWeight[]) => FlockWeight.parseRows(collection))
            .do(weights => console.log('flock weight service - getByFlock - weights:', weights));
    }

    private updateDB(flockWeight: FlockWeight): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockWeight.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((item) => console.log('flock weight service - update', item, flockWeight));
    }

    private removeDB(flockWeight: FlockWeight): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db.delete()
                    .from(table)
                    .where(table['id'].eq(flockWeight.id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(item => console.log('flock weight service - remove', item, flockWeight));
    }

}
