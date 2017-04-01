import { Injectable } from '@angular/core';
import { MarketConsumption } from '../models/market-consumption.model';
import { Observable } from 'rxjs';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class MarketConsumptionService {

    constructor(
        private databaseService: DatabaseService
    ) {
        console.count('MarketConsumptionService constructor');
    }

    getByFlockType(flockTypeId: number): Observable<MarketConsumption[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(MarketConsumption.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['type'].eq(flockTypeId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((row: MarketConsumption[]) => MarketConsumption.parseRows(row))
            .do(() => console.log('market consumption service - getByFlockType - flock type id:', flockTypeId));
    }

}
