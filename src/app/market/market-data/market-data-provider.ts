import { Injectable } from '@angular/core';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../shared/database.service';


@Injectable()
export class MarketDataProvider {

    constructor(
        flockTypes: FlockTypeService,
        private database: DatabaseService,
        private http: HttpClient
    ) {

        flockTypes.getAll()
            .filter(types => types.length === 0)
            .flatMap(() => this.fetchMarketData())
            .do(r => console.log('types', r))
            .subscribe(marketData => this.database.import(marketData));

    }

    private fetchMarketData(): Observable<any> {
        return this.http.get('assets/market-data.json');
            // .map(res => res.json());
    }

}
