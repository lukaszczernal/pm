import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';
import { Observable } from 'rxjs/Observable';
import * as lf from 'lovefield';

@Injectable()
export class FlockDeceaseDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getByFlock(flockId: number): Observable<FlockDeceaseItem[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockDeceaseItem.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((collection: FlockDeceaseItem[]) => FlockDeceaseItem.parseRows(collection));
    }

    update(flockDeceaseItem: FlockDeceaseItem): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockDeceaseItem.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockDeceaseItem.toRow())]);
            })
            .flatMap(query => query.exec());
    }

}
