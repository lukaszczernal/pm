import { Injectable } from '@angular/core';
import { FlockFodder } from '../../models/flock-fodder.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';
import * as lf from 'lovefield';

@Injectable()
export class FlockFodderService {

    public fodders: ReplaySubject<FlockFodder[]> = new ReplaySubject(1);
    public update: Subject<FlockFodder> = new Subject();
    public refresh: Subject<number> = new Subject();
    public remove: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockFodderService constructor');

        this.refresh
            .do(fid => console.log('flock fodder service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this.fodders);

        this.flockService.currentFlockId
            .do((id) => console.log('flock fodder service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(fodder => this.updateDB(fodder))
            .switchMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock fodder service - remove id:', iid))
            .flatMap(fodderId => this.removeDB(fodderId))
            .flatMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

    }

    private getByFlock(flockId: number): Observable<FlockFodder[]> {
        return this.databaseService.connect()
            .map((db) => {
                let table = db.getSchema().table(FlockFodder.TABLE_NAME);
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
                let table = db.getSchema().table(FlockFodder.TABLE_NAME);
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
                let table = db.getSchema().table(FlockFodder.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(f => console.log('flock fodder service - removeDB', f));
    }

}
