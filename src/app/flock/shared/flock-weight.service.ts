import { Injectable } from '@angular/core';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';
import { FlockWeight } from '../../models/flock-weight.model';
import { MarketWeight } from 'app/models/market-weight.model';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
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

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMapTo';
import { FlockInsert } from './flock-insert.model';
import { FlockQuantity } from '../../models/flock-quantity.model';

@Injectable()
export class FlockWeightService {

    public collection: Observable<FlockWeight[]>;
    public weights: Observable<FlockDatesWeight[]>;
    public currentWeight: Observable<FlockDatesWeight>;
    public update: Subject<FlockWeight> = new Subject();
    public remove: Subject<FlockWeight> = new Subject();
    public refresh: Subject<number> = new Subject();

    private marketWeight: Observable<MarketWeight[]>;

    constructor(
        private flockQuantityService: FlockQuantityService,
        private flockInsertsService: FlockInsertsService,
        private marketWeightService: MarketWeightService,
        private flockDatesService: FlockDatesService,
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockWeightService constructor');

        this.marketWeight = this.flockService.currentFlockType
            .map(flockType => flockType.id)
            .flatMap(flockId => this.marketWeightService.getByFlockType(flockId))
            .do(r => console.log('sat-weight market', r));

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

        this.weights = this.flockDatesService.breedingDatesString
            .map(dates => dates
                .map((date, day) =>
                    new FlockDatesWeight({date, day}))
            )
            .switchMapTo(this.collection, (a, b): [FlockDatesWeight[], FlockWeight[]] => [a, b])
            .do(r => console.log('sat-weight 2', r))
            .map(data => laylow.replaceJoin(data, 'date', 'date', 'weightItem'))
            .withLatestFrom(this.marketWeight)
            .do(r => console.log('sat-weight - 3 marketWeight', r))
            .map(data => laylow.mergeJoin(data, 'day', 'day', 'marketWeight', 'value'))
            .switchMapTo(this.flockQuantityService.quantity, (a, b): [FlockDatesWeight[], FlockQuantity[]] => [a, b])
            .do(r => console.log('sat-weight - 4 quantity', r))
            .map(data => laylow.mergeJoin(data, 'date', 'date', 'quantity', 'total'))
            .withLatestFrom(this.flockService.currentFlockId)
            .do(id => console.log('sat-weight - 5 currentFlockId', id))
            .map(([items, flockId]) => items
                .map(item => {
                    item.weightItem = item.weightItem || new FlockWeight({
                        date: new Date(item.date),
                        value: 0,
                        flock: flockId
                    });
                    item.weight = item.weightItem.value;
                    return item;
                })
            )
            .map(items => items
                .map(item => {
                    const weight = item.weight || item.marketWeight || 0;
                    item.weightTotal = weight * item.quantity;
                    return item;
                })
            )
            .map(items => {
                items.reduce((prevWeight, item) => {
                    const weight = item.weight || item.marketWeight;
                    item.increment = (weight - prevWeight);
                    return weight;
                }, 0);
                return items;
            })
            .map(items => {
                items.reduce((prevWeightTotal, item) => {
                    item.incrementTotal = (prevWeightTotal) ? Math.max(item.weightTotal - prevWeightTotal, 0) : 0;
                    return item.weightTotal;
                }, 0);
                return items;
            })
            .withLatestFrom(this.flockService.currentFlock, (items, flock): [FlockDatesWeight[], Flock] => [items, flock])
            .do(r => console.log('sat-weight - 6 currentFlock', r[1].name))
            .map(([items, flock]) => items
                .map(item => {
                    item.density = item.weightTotal / flock.coopSize;
                    return item;
                })
            )
            .do(r => console.log('sat-weight - 7 density', r.map(i => i.density).length))
            .switchMapTo(this.flockInsertsService.firstInsert, (a, b): [FlockDatesWeight[], FlockInsert] => [a, b])
            .do(r => console.log('sat-weight - 8 firstInsert', r))
            .map(([items, firstInsert]) => {
                const firstDay = items.find(item => item.day === 0);
                firstDay.weight = firstDay.weightItem.value = firstInsert.weight;
                return items;
            })
            .do(r => console.log('sat1-weight - 9 final weights', r))
            .share();

        this.currentWeight = this.weights
            .do(r => console.log('!!! currentWeight 1', r))
            .map(items => items
                .filter(item => item.weight > 0))
            .do(r => console.log('!!! currentWeight 2', r))
            .map(items => items
                // TODO we should stop using breedingDatesString and use breedingDatesMoment (in format YYYY-MM-DD)
                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day')))
            .do(r => console.log('!!! currentWeight 3', r))
            .map(items => _
                // TODO we should stop using breedingDatesString and use breedingDatesMoment (in format YYYY-MM-DD)
                .maxBy(items, item => new Date(item.date).getTime()));

    }

    private getByFlock(flockId: number): Observable<FlockWeight[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
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
