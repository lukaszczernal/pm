import { Injectable, NgZone } from '@angular/core';
import { FlockDecease } from '../../models/flock-decease.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import * as _ from 'lodash';

@Injectable()
export class FlockDeceaseService {

    public flockDeceases: Observable<FlockDecease[]>;
    public byDate: Observable<any>;
    public update: Subject<FlockDecease> = new Subject();
    public refresh: Subject<number> = new Subject();

    private _flockDeceases: ReplaySubject<FlockDecease[]> = new ReplaySubject(1);

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private zone: NgZone
    ) {
        console.count('FlockDeceaseService constructor');

        this.flockDeceases = this._flockDeceases.asObservable();

        this.byDate = this.flockDeceases
            .map(items => _(items)
                .groupBy('date')
                .mapValues((sameDateItems, date, origin) => {
                    return _(sameDateItems).sumBy('quantity');
                })
                .value()
            );

        this.refresh
            .do(fid => console.log('flock decease service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this._flockDeceases);

        this.flockService.currentFlockId
            .do((id) => console.log('flock decease service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(flock => this.updateDB(flock))
            .switchMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

    }

    private getByFlock(flockId: number): Observable<FlockDecease[]> {
        return this.databaseService.connect()
            .map((db) => {
                let table = db.getSchema().table(FlockDecease.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((flockDeceases: FlockDecease[]) => FlockDecease.parseRows(flockDeceases))
            .do((deceases) => console.log('flock decease service - getByFlock - deceases:', deceases));
    }

    private updateDB(flockDecease: FlockDecease): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockDecease.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flockDecease.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((item) => console.log('flock decease service - update', item, flockDecease));
    }

}