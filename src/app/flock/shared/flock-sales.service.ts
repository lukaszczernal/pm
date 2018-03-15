import { Injectable } from '@angular/core';
import { FlockSales } from '../../models/flock-sales.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/merge';
import { FlockSaleDbService } from '../../shared/service/flock-sale-db.service';

@Injectable()
export class FlockSalesService {

    public items: Observable<FlockSales[]>;
    public update: Subject<FlockSales> = new Subject();
    public refresh: Subject<any> = new Subject();
    public remove: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        flockSaleDB: FlockSaleDbService
    ) {
        console.count('FlockSalesService constructor');

        this.items = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .do(fid => console.log('flock sales service - refresh - flockID:', fid))
            .flatMap(flockId => flockSaleDB.getByFlock(flockId));

        this.update
            .flatMap(sale => flockSaleDB.update(sale))
            .withLatestFrom(() => this.flockService.currentFlockId, (trigger, id) => id)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock sales service - remove id:', iid))
            .flatMap(saleId => flockSaleDB.remove(saleId))
            .withLatestFrom(() => this.flockService.currentFlockId, (trigger, id) => id)
            .subscribe(this.refresh);

    }

    get(id): Observable<FlockSales> {
        return this.items
            .flatMap(sales => sales)
            .filter(sale => sale.id === parseInt(id, 10));
    }

}
