import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/database.service';
import { Observable } from 'rxjs/Observable';
import { FlockSales } from '../../models/flock-sales.model';
import * as lf from 'lovefield';

@Injectable()
export class FlockSaleDbService {

    constructor(
        private databaseService: DatabaseService,
    ) { }

    getByFlock(flockId: number): Observable<FlockSales[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((sales: FlockSales[]) => FlockSales.parseRows(sales));
    }

    update(sale: FlockSales): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(sale.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }

    remove(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()));
    }

}
