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

        // TODO - not a clean code - flockInserts are ordered by date ASC
        this.firstInsert = this.flockInserts
            .map(inserts => inserts.length > 0 ? inserts[0] : new FlockInsert({}))
            .do(r => console.log('sat2 - firstInsert', r));

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

        this.startDate = this.firstInsert
            .map(insertion => insertion.date)
            .do(r => console.log('sat2 - startDate', r));

        this.growthDays = this.flockService.currentFlock
            .switchMapTo(this.startDate, (flock, startDate) => {
                const endDate = flock.closeDate && new Date(flock.closeDate) || new Date();
                const durationFromFirstInsertion = endDate.getTime() - startDate.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            })
            .do((days) => console.log('flock inserts service - growthDays', days));

        this.totalInserted = this.flockInserts
            .map(inserts => inserts
                .reduce((count, insert) => count + insert.quantity, 0));

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

}
