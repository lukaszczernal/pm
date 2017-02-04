import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import * as moment from 'moment';
import { FlockInsert } from './flock-insert.model';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';

@Injectable()
export class FlockInsertsService {

    public flockInserts: Observable<FlockInsert[]>;
    public firstInsert: Observable<FlockInsert>;
    public startDate: Observable<Date>;
    public growthDays: Observable<number>;
    public hasInserts: Observable<boolean>;

    public update: Subject<FlockInsert> = new Subject();
    public remove: Subject<number> = new Subject();
    public refresh: Subject<{}> = new Subject();

    private _flockInserts: BehaviorSubject<FlockInsert[]> = new BehaviorSubject([]);

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockInsertService constructor');

        this.flockInserts = this._flockInserts.asObservable();

        this.firstInsert = this._flockInserts
            .filter(inserts => Boolean(inserts.length))
            .map(inserts => inserts[0]); // TOOD - not a clean code - flockInserts are ordered by createDate ASC

        this.hasInserts = this._flockInserts
            .map(inserts => Boolean(inserts.length));

        this.startDate = this.firstInsert
            .filter(insert => Boolean(insert))
            .map(insertion => insertion.createDate);

        this.growthDays = this.startDate
            .map(createDate => {
                let durationFromFirstInsertion = new Date().getTime() - createDate.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            })
            .do((days) => console.log('flock inserts service - growthDays', days));

        this.flockService.currentFlockId
            .do((id) => console.log('flock inserts service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(flock => this.updateDB(flock))
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock inserts service - remove id:', iid))
            .flatMap(flockId => this.removeDB(flockId))
            .subscribe(this.refresh);

        this.refresh
            .do((ref) => console.log('flock inserts service - refresh:', ref))
            .switchMap(() => this.flockService.currentFlockId)
            .do(fid => console.log('flock inserts service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this._flockInserts);

    }

    get(id): Observable<FlockInsert> {
        return this.flockInserts
            .do((f) => console.log('flock inserts service - get', id, f.length))
            .map(inserts => inserts
                .find(insertion => insertion.id === parseInt(id, 10)))
            .filter(type => Boolean(type))
            .first();
    }

    private removeDB(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
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
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['createDate'], lf.Order.ASC)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((flockInserts: FlockInsert[]) => FlockInsert.parseRows(flockInserts))
            .do((inserts) => console.log('flock inserts service - getByFlock - flock id:', flockId));
    }

    private updateDB(flockInsert: FlockInsert): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockInsert.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((insert) => console.log('flock inserts service - update', insert));
    }

}
