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

}