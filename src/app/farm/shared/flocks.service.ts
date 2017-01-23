import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { Flock } from './flock.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlocksService {

    public flocks: Observable<Flock[]>;
    public activeFlocks: Observable<Flock[]>;
    public closedFlocks: Observable<Flock[]>;

    public add: Subject<Flock> = new Subject();
    public update: Subject<Flock> = new Subject();
    public refresh: Subject<{}> = new Subject();

    private database: lf.Database;
    private table: lf.schema.Table;

    private _flocks: ReplaySubject<Flock[]> = new ReplaySubject();

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {
        console.count('FlocksService constructor');

        this.flocks = this.getAll()
            .do((flocks) => console.log('flock service - flocks', flocks.length))
            .do(flocks => this._flocks.next(flocks))
            .switchMap(() => this._flocks)
            .publishReplay(1)
            .refCount();

        this.activeFlocks = this.flocks
            .do((flocks) => console.log('flock service - activeFlocks', flocks.length))
            .map(flocks => flocks
                .filter(flock => flock.isActive())
            );

        this.closedFlocks = this.flocks
            .do((flocks) => console.log('flock service - closedFlocks', flocks.length))
            .map(flocks => flocks
                .filter(flock => !flock.isActive())
            );

        this.update
            .flatMap(flock => this.updateDB(flock))
            .subscribe(this.refresh);

        this.add
            .flatMap(flock => this.updateDB(flock))
            .subscribe(this.refresh);

        this.refresh
            .flatMap(() => this.getAll())
            .subscribe(this._flocks);

    }

    getAll(): Observable<Flock[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(Flock.TABLE_NAME);
                return db
                    .select()
                    .from(table)
                    .orderBy(table['createDate'], lf.Order.DESC);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((flocks) => console.log('flock service - getAll', flocks.length))
            .map(flocks => Flock.parseRows(flocks));
    }

    get(flockId): Observable<Flock> {
        return this.flocks
            .do((f) => console.log('flock service - get', flockId, f.length))
            .map(flocks => flocks
                .find(flock => flock.id === parseInt(flockId, 10)))
            .filter(flock => Boolean(flock));
    }
    remove(flock: Flock): Observable<Object> { // TOOD is it used anywhere?
        const query = this.database
            .delete()
            .from(this.table)
            .where(this.table['id'].eq(flock.id));

        return Observable.fromPromise(query.exec());
    }

    private updateDB(flock: Flock): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(Flock.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(flock.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((db) => console.log('flock service - updateDB', db));
    }

}
