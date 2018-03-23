import { Injectable } from '@angular/core';
import { FlockSales } from '../../models/flock-sales.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';

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
        private flockSaleDB: FlockSaleDbService
    ) {
        console.count('FlockSalesService constructor');

        this.items = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .do(fid => console.log('flock sales service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlockId(flockId));

        this.update
            .flatMap(sale => flockSaleDB.update(sale))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, id) => id)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock sales service - remove id:', iid))
            .flatMap(saleId => flockSaleDB.remove(saleId))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, id) => id)
            .subscribe(this.refresh);

    }

    get(id): Observable<FlockSales> {
        return this.items
            .flatMap(sales => sales)
            .filter(sale => sale.id === parseInt(id, 10));
    }

    getByFlockId(flockId: number): Observable<FlockSales[]> {
        return this.flockSaleDB.getByFlock(flockId);
    }

    getSalesSummary(flockId): Observable<FlockSalesSummary> {
        return this.getByFlockId(flockId)
            .map(this.calculateSummary);
    }

    private calculateSummary(sales: FlockSales[]): FlockSalesSummary {
        return sales.reduce((summary, sale) => {
            summary.quantity = summary.quantity + sale.quantity;
            summary.weight = summary.weight + sale.weight;
            summary.income = summary.income + (sale.price * sale.weight);
            return summary;
        }, {quantity: 0, weight: 0, income: 0} as FlockSalesSummary);
    }
}

export interface FlockSalesSummary {
    quantity: number;
    weight: number;
    income: number;
}
