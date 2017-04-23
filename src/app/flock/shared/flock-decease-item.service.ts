import { Injectable, NgZone } from '@angular/core';
import { FlockDecease } from '../../models/flock-decease.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { MarketDeceaseRateService } from 'app/market/market-decease-rate.service';
import { MarketDeceaseRate } from 'app/models/market-decease-rate.model';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockDeceaseItem } from "app/models/flock-decease-item.model";

@Injectable()
export class FlockDeceaseItemService {

    public collection: Observable<FlockDeceaseItem[]>;
    public update: Subject<FlockDeceaseItem> = new Subject();
    public refresh: Subject<number> = new Subject();

    private _collection: ReplaySubject<FlockDeceaseItem[]> = new ReplaySubject(1);

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private zone: NgZone
    ) {
        console.count('FlockDeceaseItemService constructor');

        this.collection = this._collection.asObservable();

        this.refresh
            .do(fid => console.log('flock decease service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this._collection);

        this.flockService.currentFlockId
            .do((id) => console.log('flock decease service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(flock => this.updateDB(flock))
            .switchMap(() => this.flockService.currentFlockId)
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
