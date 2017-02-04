import { Injectable } from '@angular/core';
import { MarketDeceaseRate } from '../models/market-decease-rate.model';
import { Observable } from 'rxjs';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class MarketDeceaseRateService {

    constructor(
        private databaseService: DatabaseService
    ) {
        console.count('MarketDeceaseRateService constructor');
    }

    getByFlockType(flockTypeId: number): Observable<MarketDeceaseRate[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(MarketDeceaseRate.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['type'].eq(flockTypeId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((mdr: MarketDeceaseRate[]) => MarketDeceaseRate.parseRows(mdr))
            .do(() => console.log('market decease rate service - getByFlockType - flock type id:', flockTypeId));
    }

}
