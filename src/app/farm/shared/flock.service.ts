import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { Flock } from './flock.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { QueryState } from '../../shared/query-state';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockService {

    updates: Subject<any> = new Subject<any>();
    flocks: Observable<Flock[]>;

    private db: any; // TODO typing
    private database: lf.Database;
    private table: lf.schema.Table;
    private queryStates: QueryState[] = [];

    private handler = (changes: Object[]) => {
        this.ngZone.run(() => {
            this.updateFlocks(Flock.parseRows(changes.pop()['object']));
        });
    };

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {
        console.count('FlockService constructor');

        this.db = this.databaseService.connect()
            .map(database => {
                this.setDatabase(database);
                this.setTable(Flock.TABLE_NAME);
                return database;
            })
            .publishReplay(1)
            .refCount();

        this.flocks = this.db  // TODO consider wrapinginto getAll function
            .map(() => this.observe(this.selectAll(), this.handler))
            .switchMap(() => this.setOperationStream());

    }

    updateFlocks(newFlocks: Flock[]) {
        console.log('updateFlocks', newFlocks);
        this.updates
            .next( (flocks: Flock[]): Flock[] => {
                return newFlocks;
            });
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

    private setTable(tablename: string): lf.schema.Table {
        this.table = this.database.getSchema().table(tablename);
        return this.table;
    }

    private setDatabase(database: lf.Database): lf.Database {
        this.database = database;
        return database;
    }


    private observe(query: lf.query.Select, handler: Function, ...args): Observable<Object[]> {
        this.database.observe(query, handler);
        this.queryStates.push({
            query: query,
            handler: handler
        });

        return Observable.fromPromise(query.exec());
    }

    private setOperationStream() {
        return this.updates
            .scan((flocks: Flock[], operation: FlocksOperation) => {
                    return operation(flocks);
                }, [])
            .publishReplay(1)
            .refCount();
    }

    private selectAll() {
        return this.database.select().from(this.table);
    }

}

interface FlocksOperation extends Function {
    (flocks: Flock[]): Flock[];
}
