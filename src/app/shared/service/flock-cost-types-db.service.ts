import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';
import { FlockCostType } from '../../models/flock-cost-type.model';

@Injectable()
export class FlockCostTypesDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    // TODO the only differences between funcitons in those services are typings and table name - unify

    getAll(): Observable<FlockCostType[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockCostType.TABLE_NAME);
                return db.select()
                    .from(table);
            })
            .flatMap(query => query.exec())
            .map((collection: FlockCostType[]) => FlockCostType.parseRows(collection));
    }

    getByFlock(flockId: number): Observable<FlockCostType[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockCostType.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((collection: FlockCostType[]) => FlockCostType.parseRows(collection));
    }

    update(flockCostType: FlockCostType): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockCostType.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockCostType.toRow())]);
            })
            .flatMap(query => query.exec());
    }

}
