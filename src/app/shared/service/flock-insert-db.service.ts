import { Injectable } from '@angular/core';
import { FlockWeight } from '../../models/flock-weight.model';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';

import 'rxjs/add/operator/take';
import { FlockInsert } from '../../flock/shared/flock-insert.model';

@Injectable()
export class FlockInsertDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getByFlock(flockId: number): Observable<FlockInsert[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockInsert.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['date'], lf.Order.ASC)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => query.exec())
            .map((flockInserts: FlockInsert[]) => FlockInsert.parseRows(flockInserts))
            .do((inserts) => console.log('flock inserts service - getByFlock - flock id:', flockId));
    }

    remove(id: number): Observable<any> {
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

    update(flockInsert: FlockInsert): Observable<Object[]> {
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
