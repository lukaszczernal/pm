import { Injectable } from '@angular/core';
import { FlockFodder } from '../../models/flock-fodder.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';
import * as lf from 'lovefield';
import * as _ from 'lodash';
import * as laylo from 'app/helpers/lcdash';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketConsumptionService } from '../../market/market-consumption.service';
import { MarketConsumption } from '../../models/market-consumption.model';

import 'rxjs/add/operator/take';

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
        private flockService: FlockService,
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
            .flatMap(flockId => this.getByFlock(flockId));

        this.totalPurchase = this.fodders
            .map(purchases => purchases
                .reduce((count, purchase) => count + purchase.quantity, 0));

        this.totalFodderConsumption = this.flockService.currentFlock
            .take(1)
            .switchMapTo(this.totalPurchase, (flock, totalPurchase) => {
                return totalPurchase - flock.remainingFodder;
            });

        this.update
            .flatMap(fodder => this.updateDB(fodder))
            .flatMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock fodder service - remove id:', iid))
            .flatMap(fodderId => this.removeDB(fodderId))
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

    private getByFlock(flockId: number): Observable<FlockFodder[]> {
        return this.databaseService.connect()
            .map((db) => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId))
                    .orderBy(table['date'], lf.Order.ASC);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((fodders: FlockFodder[]) => FlockFodder.parseRows(fodders))
            .do(fodders => console.log('flock fodder service - getByFlock - fodders:', fodders));
    }

    get(id): Observable<FlockFodder> {
        return this.fodders
            .do(f => console.log('flock fodder service - get', id, f.length))
            .flatMap(fodders => fodders)
            .filter(fodder => fodder.id === parseInt(id, 10));
    }

    private updateDB(fodder: FlockFodder): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(fodder.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((item) => console.log('flock fodder service - update', item));
    }

    private removeDB(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(f => console.log('flock fodder service - removeDB', f));
    }

}

interface FlockFoddersMergedByDate {
    date: string;
    quantity: number;
};
