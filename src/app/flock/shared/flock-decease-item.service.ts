import { Injectable } from '@angular/core';
import { FlockDecease } from '../../models/flock-decease.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketDeceaseRateService } from 'app/market/market-decease-rate.service';
import { MarketDeceaseRate } from '../../models/market-decease-rate.model';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';

import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';

@Injectable()
export class FlockDeceaseItemService {

    public collection: Observable<FlockDeceaseItem[]>;
    // public collection: ReplaySubject<FlockDeceaseItem[]> = new ReplaySubject(1);
    public update: Subject<FlockDeceaseItem> = new Subject();
    public refresh: Subject<number> = new Subject();

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockDeceaseItemService constructor');

        this.collection = this.flockService.currentFlockId
            .take(1)
            .merge(this.refresh)
            .flatMap(flockId => this.getByFlock(flockId));

        this.update
            .flatMap(flock => this.updateDB(flock))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

    }

    private getByFlock(flockId: number): Observable<FlockDeceaseItem[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockDeceaseItem.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((collection: FlockDeceaseItem[]) => FlockDeceaseItem.parseRows(collection))
            .do((deceases) => console.log('flock decease service - getByFlock - deceases:', deceases));
    }

    private updateDB(flockDeceaseItem: FlockDeceaseItem): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockDeceaseItem.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockDeceaseItem.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((item) => console.log('flock decease service - update', item, flockDeceaseItem));
    }

}
