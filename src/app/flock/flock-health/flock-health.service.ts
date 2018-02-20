import { Injectable } from '@angular/core';
import { FlockHealth } from '../../models/flock-health.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import * as lf from 'lovefield';

@Injectable()
export class FlockHealthService {

    public items: ReplaySubject<FlockHealth[]> = new ReplaySubject(1);
    public update: Subject<FlockHealth> = new Subject();
    public refresh: Subject<number> = new Subject();
    public remove: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockHealthService constructor');

        this.refresh
            .do(fid => console.log('flock health service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this.items);

        this.flockService.currentFlockId
            .do((id) => console.log('flock health service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(fodder => this.updateDB(fodder))
            .switchMap(() => this.flockService.currentFlockId)  // TODO this is wrong - it gets retriggered when flock is changed
            .subscribe(this.refresh);

        this.remove
            .flatMap(id => this.removeDB(id))
            .flatMap(() => this.flockService.currentFlockId) // TODO this is wrong - it gets retriggered when flock is changed
            .do((iid) => console.log('@@@ flock health service - remove health for flock id:', iid))
            .subscribe(this.refresh);

    }

    private getByFlock(flockId: number): Observable<FlockHealth[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId))
                    .orderBy(table['date'], lf.Order.ASC);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((records: FlockHealth[]) => FlockHealth.parseRows(records))
            .do(records => console.log('flock health service - getByFlock - health records:', records));
    }

    get(id): Observable<FlockHealth> {
        return this.items
            .do(f => console.log('flock health service - get', id, f.length))
            .flatMap(items => items)
            .filter(item => item.id === parseInt(id, 10));
    }

    private updateDB(fodder: FlockHealth): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(fodder.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(item => console.log('flock health service - update', item));
    }

    private removeDB(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                const table = db.getSchema().table(FlockHealth.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(f => console.log('flock health service - removeDB', f));
    }

}
