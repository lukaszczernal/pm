import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { FlockFodder } from '../../models/flock-fodder.model';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';

@Injectable()
export class FlockFodderDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getByFlockId(flockId: number): Observable<FlockFodder[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId))
                    .orderBy(table['date'], lf.Order.ASC);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((fodders: FlockFodder[]) => FlockFodder.parseRows(fodders));
    }

    update(fodder: FlockFodder): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(fodder.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }

    remove(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }


}
