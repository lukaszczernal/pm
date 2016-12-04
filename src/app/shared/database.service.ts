import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as lf from 'lovefield';
import {Flock} from '../farm/shared/flock.model';

@Injectable()
export class DatabaseService {

    private database: lf.Database;
    private connectPromise: Promise<lf.Database>;
    private schemaBuilder: lf.schema.Builder;
    private options: lf.schema.ConnectOptions = {
        storeType: lf.schema.DataStoreType.INDEXED_DB
    };

    connect(force = false): Observable<lf.Database> {
        if (!this.connectPromise || force) {

            this.schemaBuilder = this.createSchemaBuilder();

            this.connectPromise = this.schemaBuilder.connect(this.options)
                .then((database: lf.Database) => {
                    console.log('Database connected');
                    this.database = database;
                    return this.database;
                }).catch((reason) => {
                    console.error(reason);
                });
        }

        return Observable.fromPromise(this.connectPromise);
    }

    private createSchemaBuilder(): lf.schema.Builder {
        const schemaBuilder = lf.schema.create('Farm', new Date().getTime());

        Flock.createTable(schemaBuilder);

        return schemaBuilder;
    }

}
