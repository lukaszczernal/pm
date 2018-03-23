import { Injectable } from '@angular/core';
import { FlockFodder } from '../../models/flock-fodder.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../shared/database.service';
import { FlockFodderDbService } from '../../shared/service/flock-fodder-db.service';
import { FlockService } from 'app/shared/service/flock.service';
import * as lf from 'lovefield';
import * as _ from 'lodash';
import * as laylo from 'app/helpers/lcdash';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketConsumptionService } from '../../market/market-consumption.service';
import { MarketConsumption } from '../../models/market-consumption.model';

import 'rxjs/add/operator/take';
import { Flock } from 'app/models/flock.model';

@Injectable()
export class FlockFodderService {

    public fodders: Observable<FlockFodder[]>;
    public update: Subject<FlockFodder> = new Subject();
    public refresh: Subject<number> = new Subject();
    public remove: Subject<number> = new Subject();
    public foddersMergedByDate: Observable<FlockFoddersMergedByDate[]>;
    public marketConsumption: Observable<MarketConsumption[]>;
    public totalPurchase: Observable<number>;
    public totalFodderConsumption: Observable<number>;

    constructor(
        private marketConsumptionService: MarketConsumptionService,
        private flockDatesService: FlockDatesService,
        private databaseService: DatabaseService,
        private flockFodderDB: FlockFodderDbService,
        private flockService: FlockService
    ) {
        console.count('FlockFodderService constructor');

        this.marketConsumption = this.flockService.currentFlock
            .take(1)
            .map(flock => flock.type)
            .flatMap(flockType => this.marketConsumptionService.getByFlockType(flockType));

        this.fodders = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .do(fid => console.log('flock fodder service - refresh - flockID:', fid))
            .switchMap(flockId => this.getPurchasesByFlockId(flockId));

        this.totalPurchase = this.fodders
            .map(purchases => purchases
                .reduce((count, purchase) => count + purchase.quantity, 0));

        this.totalFodderConsumption = this.flockService.currentFlock
            .take(1)
            .switchMapTo(this.totalPurchase, (flock, totalPurchase) => {
                return totalPurchase - flock.remainingFodder;
            });

        this.update
            .flatMap(fodder => this.flockFodderDB.update(fodder))
            .flatMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock fodder service - remove id:', iid))
            .flatMap(fodderId => this.flockFodderDB.remove(fodderId))
            .flatMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.foddersMergedByDate = this.fodders
            .map(items => _(items)
                .groupBy('date')
                .mapValues((sameDateFodderPurchase, date, origin) => {
                    return {
                        date: date,
                        quantity: _(sameDateFodderPurchase).sumBy('quantity')
                    } as FlockFoddersMergedByDate;
                })
                .transform((result, value, key) => {
                    result.push(value);
                }, [])
                .value()
            );

    }

    getPurchasesByFlockId(flockId: number): Observable<FlockFodder[]> {
        return this.flockFodderDB.getByFlockId(flockId);
    }

    get(id): Observable<FlockFodder> {
        return this.fodders
            .do(f => console.log('flock fodder service - get', id, f.length))
            .flatMap(fodders => fodders)
            .filter(fodder => fodder.id === parseInt(id, 10));
    }

    getPurchasedQuantity(flockId: number): Observable<number> {
        return this.getPurchasesByFlockId(flockId)
            .map(this.sumPurchasedQuantity)
    }

    getPurchasedValue(flockId: number): Observable<number> {
        return this.getPurchasesByFlockId(flockId)
            .map(this.sumPurchasedValue)
    }

    getFodderConsumption(flock: Flock): Observable<number> {
        return this.getPurchasedQuantity(flock.id)
            .map(purchasedQuantity => purchasedQuantity - flock.remainingFodder);
    }

    private sumPurchasedValue(purchases: FlockFodder[]): number {
        return purchases
            .reduce((sum, purchase) => sum + (purchase.price * purchase.quantity / 1000), 0)
    }

    private sumPurchasedQuantity(purchases: FlockFodder[]): number {
        return purchases
            .reduce((count, purchase) => count + purchase.quantity, 0);
    }

}

interface FlockFoddersMergedByDate {
    date: string;
    quantity: number;
};
