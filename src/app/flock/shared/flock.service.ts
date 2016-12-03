import {Injectable} from '@angular/core';
import * as lf from 'lovefield';
import {Flock} from './flock.model';
import {Observable} from 'rxjs';
import {QueryState} from '../../shared/query-state';

@Injectable()
export class FlockService {

    private database: lf.Database;
    private table: lf.schema.Table;
    private queryStates: QueryState[] = [];

    constructor() {
    }

    init(database: lf.Database) {
        this.database = database;
        this.table = database.getSchema().table(Flock.TABLE_NAME);
    }

    observe(handler: Function, ...args): Observable<Object[]> {
        const query = this.database
            .select()
            .from(this.table);

        if (args['id']) {
            query.where(this.table['id'].eq(args['id']));
        }

        this.database.observe(query, handler);
        this.queryStates.push({
            query: query,
            handler: handler
        });

        return Observable.fromPromise(query.exec());
    }

    unobserve(): void {
        for (const [index, queryState] of this.queryStates.entries()) {
            this.database.unobserve(queryState.query, queryState.handler);
            this.queryStates.splice(index, 1);
        }
    }

    add(flock: Flock): Observable<Object[]> {
        const query = this.database
            .insert()
            .into(this.table)
            .values([this.table.createRow(flock.toRow())]);

        return Observable.fromPromise(query.exec());
    }

    remove(flock: Flock): Observable<Object[]> {
        const query = this.database
            .delete()
            .from(this.table)
            .where(this.table['id'].eq(flock.id));

        return Observable.fromPromise(query.exec());
    }

}

