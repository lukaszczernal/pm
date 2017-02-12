import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as lf from 'lovefield';
import { Flock } from '../farm/shared/flock.model';
import { FlockType } from '../farm/shared/flock-type.model';
import { FlockInsert } from '../flock/shared/flock-insert.model';
import { FlockDecease } from '../flock/flock-decease/flock-decease.model';
import { FlockSales } from '../models/flock-sales.model';
import { FlockFodder } from '../models/flock-fodder.model';
import { MarketDeceaseRate } from '../models/market-decease-rate.model';
import { FlockWeight } from '../models/flock-weight.model';
import { MarketWeight } from '../models/market-weight.model';

@Injectable()
export class DatabaseService {

    private database: lf.Database;
    private connectPromise: Promise<lf.Database>;
    private schemaBuilder: lf.schema.Builder;
    private options: lf.schema.ConnectOptions = {
        storeType: lf.schema.DataStoreType.INDEXED_DB
        // onUpgrade: () => new Promise(() => 'Lovefield DB needs an upgrade') // TODO need to look into that, might be usefull
    };

    connect(force = false): Observable<lf.Database> {
        if (!this.connectPromise || force) {

            this.schemaBuilder = this.createSchemaBuilder();

            this.connectPromise = this.schemaBuilder.connect(this.options)
                .then((database: lf.Database) => {
                    this.database = database;
                    return this.database;
                }).catch((reason) => {
                    console.error(reason);
                });
        }

        return Observable.fromPromise(this.connectPromise);
    }

    export(): Observable<Object> {
        return this.connect()
            .flatMap(db => Observable.fromPromise(this.database.export()))
            .map(data => JSON.stringify(data));
    }

    import(data): void {
        data = JSON.parse(data, this.jsonDateParser);
        this.connect()
            .subscribe(db => db.import(data));
    }

    update(tableName: string, rows: any[]): Observable<Object[]> {

        return this.connect()
            .map(db => {
                let table = db.getSchema().table(tableName);
                let tableRows = rows.map(row => table.createRow(row));

                return db.insertOrReplace().into(table).values(tableRows);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(() => console.log('database service - update', tableName));
    }

    private createSchemaBuilder(): lf.schema.Builder {
        const schemaBuilder = lf.schema.create('Farm', 1485994492755); // TODO check why I should not pass DAte

        Flock.createTable(schemaBuilder);
        FlockType.createTable(schemaBuilder);
        FlockSales.createTable(schemaBuilder);
        FlockFodder.createTable(schemaBuilder);
        FlockInsert.createTable(schemaBuilder);
        FlockWeight.createTable(schemaBuilder);
        FlockDecease.createTable(schemaBuilder);
        MarketWeight.createTable(schemaBuilder);
        MarketDeceaseRate.createTable(schemaBuilder);

        return schemaBuilder;
    }

    private jsonDateParser(key, value) {
        let reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        let reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

        if (typeof value === 'string') {
            let a = reISO.exec(value);
            if (a) {
                return new Date(value);
            };
            a = reMsAjax.exec(value);
            if (a) {
                let b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    }

}
