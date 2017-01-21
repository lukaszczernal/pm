import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { FlockInsert } from './flock-insert.model';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../../farm/shared/flock.service';

@Injectable()
export class FlockInsertsService {

    public flockInserts: Observable<FlockInsert[]>;

    private _flockInserts: ReplaySubject<FlockInsert[]> = new ReplaySubject();
    public setFlockId: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private zone: NgZone
    ) {

        this.flockInserts = this._flockInserts.asObservable();

        this.flockService.currentFlockId
            .combineLatest(this.databaseService.connect(), (flockId, db: lf.Database) => [flockId, db])
            .map(([flockId, db]) => {
                console.log('flockId', flockId);
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['createDate'], lf.Order.ASC)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((flockInserts: FlockInsert[]) => FlockInsert.parseRows(flockInserts))
            .do((flocks) => console.log('flock inserts service - getAll - length:', flocks.length))
            .subscribe(inserts => this.zone.run(() => {
                this._flockInserts.next(inserts);
            }));

    }

    get(id): Observable<FlockInsert> {
        return this._flockInserts
            .do((f) => console.log('flock inserts service - get', id, f.length))
            .map(inserts => inserts
                .find(insertion => insertion.id === parseInt(id, 10)))
            .filter(type => Boolean(type));
    }

    update(flockInsert: FlockInsert): Observable<Object[]> {
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

    remove(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((f) => console.log('flock inserts service - remove', f));
    }

}
