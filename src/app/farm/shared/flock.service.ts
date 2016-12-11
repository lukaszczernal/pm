import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { Flock } from './flock.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { QueryState } from '../../shared/query-state';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockService {

    private db: any; // TODO typing
    private database: lf.Database;
    private table: lf.schema.Table;
    private queryStates: QueryState[] = [];

    private _flocks: BehaviorSubject<Flock[]> = new BehaviorSubject([] as Flock[]);

    public flocks: Observable<Flock[]>;
    public activeFlocks: Observable<Flock[]>;
    public closedFlocks: Observable<Flock[]>;

    private handler = (changes: Object[]) => {
        this.ngZone.run(() => {
            this._flocks.next(Flock.parseRows(changes.pop()['object']));
        });
    };

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {
        console.count('FlockService constructor');
        this.db = this.databaseService.connect()
            .map(database => {
                this.database = database;
                this.table = database.getSchema().table(Flock.TABLE_NAME);
                return database;
            })
            .publishReplay(1)
            .refCount();

        this.flocks = this.getAll()
            .switchMap(() => this._flocks);

        this.activeFlocks = this.flocks
            .map(flocks => flocks
                .filter(flock => flock.isActive())
            );

        this.closedFlocks = this.flocks
            .map(flocks => flocks
                .filter(flock => !flock.isActive())
            );
    }

    update(flock: Flock): Observable<Object[]> {
        return this.db
            .switchMap(db => {
                return db
                    .insertOrReplace()
                    .into(this.table)
                    .values([this.table.createRow(flock.toRow())])
                    .exec();
            });
    }

    getAll(): Observable<Flock[]> {
        return this.db
            .map(db => {
                return db
                    .select()
                    .from(this.table)
                    .orderBy(this.table['createDate'], lf.Order.DESC);
            })
            .map(query => this.observe(query, this.handler))
            .share();

    }

    get(id: number): Observable<Object> {
        return this.db
            .switchMap(db => {
                return db
                    .select()
                    .from(this.table)
                    .where(this.table['id'].eq(id))
                    .exec();
            })
            .flatMap(flocks => {
                return Flock.parseRows(flocks);
            });
    }

    add(newFlock: Flock): Observable<Object[]> {
        return this.db
            .switchMap(db => {
                return db
                    .insert()
                    .into(this.table)
                    .values([this.table.createRow(newFlock.toRow())])
                    .exec();
            });
    }

    remove(flock: Flock): Observable<Object> {
        const query = this.database
            .delete()
            .from(this.table)
            .where(this.table['id'].eq(flock.id));

        return Observable.fromPromise(query.exec());
    }

    public unobserve(): void { // TODO move to base service
        for (const [index, queryState] of this.queryStates.entries()) {
            this.database.unobserve(queryState.query, queryState.handler);
            this.queryStates.splice(index, 1);
        }
    }

    private observe(query: lf.query.Select, handler: Function, ...args): Observable<Object[]> {
        this.database.observe(query, handler);
        this.queryStates.push({
            query: query,
            handler: handler
        });

        return Observable.fromPromise(query.exec());
    }

}

interface FlocksOperation extends Function {
    (flocks: Flock[]): Flock[];
}
