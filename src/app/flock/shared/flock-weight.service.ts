import { Injectable, NgZone } from '@angular/core';
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

@Injectable()
export class FlockWeightService {

    public collection: Observable<FlockWeight[]>;
    public weights: Observable<FlockDatesWeight[]>;
    public currentWeight: Observable<FlockDatesWeight>;
    public update: Subject<FlockWeight> = new Subject();
    public remove: Subject<FlockWeight> = new Subject();
    public refresh: Subject<number> = new Subject();

    private marketWeight: Observable<MarketWeight[]>;
    private _collection: ReplaySubject<FlockWeight[]> = new ReplaySubject(1);

    constructor(
        private flockQuantityService: FlockQuantityService,
        private marketWeightService: MarketWeightService,
        private flockDatesService: FlockDatesService,
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private zone: NgZone
    ) {
        console.count('FlockWeightService constructor');

        this.marketWeight = this.flockService.currentFlockType
            .do(() => console.log('flock weight service - marketWeight'))
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType.id));

        this.collection = this._collection.asObservable();

        this.refresh
            .do(fid => console.log('flock weight service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this._collection);

        this.flockService.currentFlockId
            .do((id) => console.log('flock weight service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(flock => this.updateDB(flock))
            .switchMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.remove
            .flatMap(flock => this.removeDB(flock))
            .switchMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.weights = this.flockDatesService.breedingDatesString
            .map(dates => dates
                .map((date, day) =>
                    new FlockDatesWeight({date, day}))
            )
            .combineLatest(this.collection)
            .map(data => laylow.replaceJoin(data, 'date', 'date', 'weightItem'))
            .combineLatest(this.marketWeight)
            .map(data => laylow.mergeJoin(data, 'day', 'day', 'marketWeight', 'value'))
            .combineLatest(this.flockQuantityService.quantity)
            .map(data => laylow.mergeJoin(data, 'date', 'date', 'quantity', 'total'))
            .combineLatest(this.flockService.currentFlockId, (items, flockId): [FlockDatesWeight[], number] => [items, flockId])
            .map(([items, flockId]) => items
                .map(item => {
                    item.weightItem = item.weightItem || new FlockWeight({
                        date: new Date(item.date),
                        value: undefined,
                        flock: flockId
                    });
                    item.weight = item.weightItem.value;
                    return item;
                })
            )
            .map(items => items
                .map(item => {
                    const weight = item.weight || item.marketWeight;
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
                    item.incrementTotal = (prevWeightTotal) ? item.weightTotal - prevWeightTotal : 0;
                    return item.weightTotal;
                }, 0);
                return items;
            })
            .combineLatest(this.flockService.currentFlock, (items, flock): [FlockDatesWeight[], Flock] => [items, flock])
            .map(([items, flock]) => items
                .map(item => {
                    item.density = item.weightTotal / flock.coopSize;
                    return item;
                })
            );

        this.currentWeight = this.weights
            .map(items => items
                .filter(item => item.weight > 0))
            .map(items => items
                // TODO we should stop using breedingDatesString and use breedingDatesMoment (in format YYYY-MM-DD)
                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day')))
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
