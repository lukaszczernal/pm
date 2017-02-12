import { Injectable } from '@angular/core';
import { MarketWeight } from '../models/market-weight.model';
import { Observable } from 'rxjs';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class MarketWeightService {

    constructor(
        private databaseService: DatabaseService
    ) {
        console.count('MarketWeightService constructor');
    }

    getByFlockType(flockTypeId: number): Observable<MarketWeight[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(MarketWeight.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['type'].eq(flockTypeId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((row: MarketWeight[]) => MarketWeight.parseRows(row))
            .do(() => console.log('market weight service - getByFlockType - flock type id:', flockTypeId));
    }

}
