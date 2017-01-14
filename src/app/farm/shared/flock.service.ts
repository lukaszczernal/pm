import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { Flock } from './flock.model';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { QueryState } from '../../shared/query-state';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockService {

    private db: any; // TODO typing
    private database: lf.Database;
    private table: lf.schema.Table;

    private _flocks: ReplaySubject<Flock[]> = new ReplaySubject();

    public flocks: Observable<Flock[]>;
    public activeFlocks: Observable<Flock[]>;
    public closedFlocks: Observable<Flock[]>;

    public add: Subject<Flock> = new Subject();
    public update: Subject<Flock> = new Subject();
    public refresh: Subject<{}> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {
        console.count('FlockService constructor');

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
            .flatMap(flock => this.addDB(flock))
            .subscribe(this.refresh);

        this.refresh
            .flatMap(() => this.getAll())
            .subscribe(this._flocks);

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

    get(id): Observable<Flock> {
        return this.flocks
            .do((f) => console.log('flock service - get', id, f.length))
            .map(types => types
                .find(type => type.id === parseInt(id, 10)))
            .filter(type => Boolean(type));
    }

    addDB(newFlock: Flock): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(Flock.TABLE_NAME);
                return db
                    .insert()
                    .into(table)
                    .values([table.createRow(newFlock.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((flocks) => console.log('flock service - addDB', flocks.length));
    }

    remove(flock: Flock): Observable<Object> { // TOOD is it used anywhere?
        const query = this.database
            .delete()
            .from(this.table)
            .where(this.table['id'].eq(flock.id));

        return Observable.fromPromise(query.exec());
    }

}
