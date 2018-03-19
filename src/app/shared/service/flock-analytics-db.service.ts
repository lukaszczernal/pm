import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';
import { FlockAnalytics } from '../../models/flock-analytics.model';

@Injectable()
export class FlockAnalyticsDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getAll(): Observable<FlockAnalytics[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockAnalytics.TABLE_NAME);
                return db.select()
                    .from(table);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((collection: FlockAnalytics[]) => FlockAnalytics.parseRows(collection));
    }

    getByFlock(flockId: number): Observable<FlockAnalytics[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockAnalytics.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((collection: FlockAnalytics[]) => FlockAnalytics.parseRows(collection));
    }

    update(flockAnalytics: FlockAnalytics): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockAnalytics.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockAnalytics.toRow())]);
            })
            .flatMap(query => query.exec());
    }

}
