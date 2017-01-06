import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { FlockInsert } from './flock-insert.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DatabaseService } from '../../../shared/database.service';

@Injectable()
export class FlockInsertsService {

    public flockInserts: Observable<FlockInsert[]>;

    private db: any; // TODO typing

    private _flockInserts: BehaviorSubject<FlockInsert[]> = new BehaviorSubject([] as FlockInsert[]);

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {
        this.db = this.databaseService.connect();
        this.flockInserts = this._flockInserts;
    }

    get(id: number): Observable<FlockInsert> {
        return this.db
            .switchMap(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['id'].eq(id))
                    .exec();
            })
            .flatMap(flocks => {
                return FlockInsert.parseRows(flocks);
            });
    }

    getAll(): Observable<FlockInsert[]> {
        return this.db
            .switchMap((db) => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['createDate'], lf.Order.ASC)
                    .exec();
            })
            .map(flockInserts => FlockInsert.parseRows(flockInserts))
            .map(flockInserts => this.ngZone.run(() => {
                this._flockInserts.next(flockInserts);
            }));
    }

    add(flockInsert: FlockInsert): Observable<Object[]> { // TODO move to base
        return this.db
            .switchMap((db) => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.insert()
                    .into(table)
                    .values([table.createRow(flockInsert.toRow())])
                    .exec(); // TODO get insert id and enrich model
            })
            .map(() => flockInsert);
    }

    update(flockInsert: FlockInsert): Observable<Object[]> {
        return this.db
            .switchMap(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockInsert.toRow())])
                    .exec();
            });
    }

    remove(id: number) {
        return this.db
            .switchMap(db => {
                let table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table.id.eq(id))
                    .exec();
            })
            .do(() => this.removeFromList(id));
    }

    private removeFromList(id) {
        let list = this._flockInserts
            .getValue()
            .filter(insert => insert.id !== id);
        this.ngZone.run(() => this._flockInserts.next(list));
    }

}
