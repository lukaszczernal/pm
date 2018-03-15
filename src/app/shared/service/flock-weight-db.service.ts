import { Injectable } from '@angular/core';
import { FlockWeight } from '../../models/flock-weight.model';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';

@Injectable()
export class FlockWeightDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getByFlock(flockId: number): Observable<FlockWeight[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => query.exec())
            .map((collection: FlockWeight[]) => FlockWeight.parseRows(collection));
    }

    update(flockWeight: FlockWeight): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockWeight.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }

    remove(flockWeight: FlockWeight): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockWeight.TABLE_NAME);
                return db.delete()
                    .from(table)
                    .where(table['id'].eq(flockWeight.id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }

}
