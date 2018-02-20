import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FlockInsert } from './flock-insert.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';

// import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class FlockInsertsService {

    public flockInserts: Observable<FlockInsert[]>;
    public firstInsert: Observable<FlockInsert>;
    public insertsByDate: Observable<any>;
    public startDate: Observable<Date>;
    public growthDays: Observable<number>;
    public hasInserts: Observable<boolean>;

    public update: Subject<FlockInsert> = new Subject();
    public remove: Subject<number> = new Subject();
    public refresh: Subject<{}> = new Subject();

    // private insertsUpdate: Subject<any> = new Subject();
    // public _flockInserts: ReplaySubject<FlockInsert[]> = new ReplaySubject(1);
    // public _insertsByDate: ReplaySubject<any[]> = new ReplaySubject(1);

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockInsertService constructor');

        // this.flockInserts = this._flockInserts.asObservable();
        // this.insertsByDate = this._insertsByDate.asObservable();

        this.flockInserts = this.flockService.currentFlockId
            // .do(fid => console.log('QQQ - flockInserts flockID:', fid))
            // .merge(this.refresh.mergeMapTo(this.flockService.currentFlockId))
            .flatMap(flockId => this.getByFlock(flockId))
            // .subscribe(this._flockInserts);
            // .shareReplay();
            // .publishReplay(1)
            // .refCount();

        // TODO - not a clean code - flockInserts are ordered by date ASC
        this.firstInsert = this.flockInserts
            .map(inserts => inserts.length > 0 ? inserts[0] : new FlockInsert({}))
            .do(r => console.log('sat2 - firstInsert', r));
            // .publishReplay(1)
            // .refCount();

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
            );
            // .subscribe(this._insertsByDate);

        this.hasInserts = this.flockInserts
            .map(inserts => Boolean(inserts.length));

        this.startDate = this.firstInsert
            .map(insertion => insertion.date)
            .do(r => console.log('sat2 - startDate', r));

        this.growthDays = this.startDate
            .map(date => {
                const durationFromFirstInsertion = new Date().getTime() - date.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            })
            .do((days) => console.log('flock inserts service - growthDays', days));

        // this.flockService.currentFlockId
        //     .do((id) => console.log('flock inserts service - currentFlockId:', id))
        //     .subscribe(this.refresh);

        this.update
            .flatMap(flock => this.updateDB(flock))
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock inserts service - remove id:', iid))
            .flatMap(flockId => this.removeDB(flockId))
            .subscribe(this.refresh);

    }

    // getStartDate() {
    //     return this.firstInsert
    //         .map(insertion => insertion.date);
    // }

    get(id): Observable<FlockInsert> {
        return this.flockInserts
            .do((f) => console.log('flock inserts service - get', id, f.length))
            .map(inserts => inserts
                .find(insertion => insertion.id === parseInt(id, 10)))
            .filter(type => Boolean(type));
    }

    private removeDB(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((f) => console.log('flock inserts service - removeDB', f));
    }

    private getByFlock(flockId: number): Observable<FlockInsert[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['date'], lf.Order.ASC)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((flockInserts: FlockInsert[]) => FlockInsert.parseRows(flockInserts))
            .do((inserts) => console.log('flock inserts service - getByFlock - flock id:', flockId));
    }

    private updateDB(flockInsert: FlockInsert): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockInsert.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((insert) => console.log('flock inserts service - update', insert));
    }

}
