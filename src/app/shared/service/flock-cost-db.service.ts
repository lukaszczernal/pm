import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';
import { FlockHealth } from '../../models/flock-health.model';

@Injectable()
export class FlockCostDbService {

    constructor(
        private databaseService: DatabaseService
    ) { }

    getByFlock(flockId: number): Observable<FlockHealth[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId))
                    .orderBy(table['date'], lf.Order.ASC);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((records: FlockHealth[]) => FlockHealth.parseRows(records))
            .do(records => console.log('flock health service - getByFlock - health records:', records));
    }


    update(fodder: FlockHealth): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(fodder.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(item => console.log('flock health service - update', item));
    }

    remove(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(f => console.log('flock health service - removeDB', f));
    }


}
