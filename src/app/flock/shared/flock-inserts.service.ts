import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FlockInsert } from './flock-insert.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';

import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockInsertDbService } from '../../shared/service/flock-insert-db.service';
import { Flock } from '../../models/flock.model';

@Injectable()
export class FlockInsertsService {

    public flockInserts: Observable<FlockInsert[]>;
    public firstInsert: Observable<FlockInsert>;
    public insertsByDate: Observable<any>;
    public startDate: Observable<Date>;
    public growthDays: Observable<number>;
    public hasInserts: Observable<boolean>;
    public totalInserted: Observable<number>;

    public update: Subject<FlockInsert> = new Subject();
    public remove: Subject<number> = new Subject();
    public refresh: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private flockInsertDB: FlockInsertDbService
    ) {
        console.count('FlockInsertService constructor');

        this.flockInserts = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .flatMap(flockId => this.flockInsertDB.getByFlock(flockId))

        this.insertsByDate = this.flockInserts
            .do(r => console.log('sat1 - insertsByDate', r))
            .map(items => _(items)
                .groupBy('date')
                .mapValues((sameDateInserts, date, origin) => {
                    return {
                        date: date,
                        quantity: _(sameDateInserts).sumBy('quantity')
                    };
                })
                .transform((result, value, key) => {
                    result.push(value);
                }, [])
                .value()
            )

        this.hasInserts = this.flockInserts
            .map(inserts => Boolean(inserts.length));

        this.startDate = this.flockInserts
            .map(this.filterStartDate);

        this.growthDays = this.startDate
            .withLatestFrom(this.flockService.currentFlock.map(flock => flock.closeDate),
                (startDate, closeDate) => {
                const endDate = closeDate && new Date(closeDate) || new Date();
                const durationFromFirstInsertion = endDate.getTime() - startDate.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            });

        this.totalInserted = this.flockInserts
            .map(this.sumUpInsertedQuantity);

        this.update
            .flatMap(flock => this.flockInsertDB.update(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock inserts service - remove id:', iid))
            .flatMap(flockId => this.flockInsertDB.remove(flockId))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

    }

    get(id): Observable<FlockInsert> {
        return this.flockInserts
            .do((f) => console.log('flock inserts service - get', id, f.length))
            .map(inserts => inserts
                .find(insertion => insertion.id === parseInt(id, 10)))
            .filter(type => Boolean(type));
    }

    getStartDate(flockId: number): Observable<Date> {
        return this.flockInsertDB.getByFlock(flockId)
            .map(this.filterStartDate);
    }

    getInsertedQuantity(flockId: number): Observable<number> {
        return this.flockInsertDB.getByFlock(flockId)
            .map(this.sumUpInsertedQuantity);
    }

    getInsertedValue(flockId: number): Observable<number> {
        return this.flockInsertDB.getByFlock(flockId)
            .map(this.sumUpInsertedValue);
    }

    getGrowthDays(flock: Flock): Observable<number> {
        return this.getStartDate(flock.id)
            .map(startDate => this.breedingDuration(startDate, flock.closeDate))
    }

    private breedingDuration(startDate, closeDate) {
        const endDate = closeDate && new Date(closeDate) || new Date();
        const breedingDuration = endDate.getTime() - startDate.getTime();
        return moment.duration(breedingDuration).asDays();
    }

    private filterStartDate(inserts: FlockInsert[]): Date {
        const firstInsertion = _.minBy(inserts, (insert) => insert.date);
        return firstInsertion ? firstInsertion.date : new Date();
    }

    private sumUpInsertedQuantity(inserts: FlockInsert[]): number {
        return inserts
            .reduce((count, insert) => count + insert.quantity, 0);
    }

    private sumUpInsertedValue(inserts: FlockInsert[]): number {
        return inserts
            .reduce((sum, insert) => sum + (insert.quantity * insert.price), 0);
    }

}
