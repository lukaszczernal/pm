import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { FlockType } from './flock-type.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { QueryState } from '../../shared/query-state';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockTypeService {

    private db: any; // TODO typing
    private database: lf.Database;
    // private table: lf.schema.Table;
    private queryStates: QueryState[] = [];

    private _flockTypes: BehaviorSubject<FlockType[]> = new BehaviorSubject([] as FlockType[]);
    private updates: Subject<any> = new Subject<any>();

    private create: Subject<FlockType> = new Subject<FlockType>();

    public flockTypes: Observable<FlockType[]>;

    private handler = (changes: Object[]) => {
        this.ngZone.run(() => {
            return (flockTypes: FlockType[]) => {
                console.log('changes', changes, FlockType.parseRows(changes.pop()['object']));
                // return flockTypes.concat(flockType);
            };
        });
    };

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {

        // this.db = this.databaseService.connect() // TODO move to base
        //     .map(database => {
        //         this.database = database;
        //         this.table = database.getSchema().table(FlockType.TABLE_NAME);
        //     })
        //     // .switchMap(this.populate)
        //     .publishReplay(1)
        //     .refCount();

        // this.flockTypes = this.getAll()
        //     .switchMap(() => this._flockTypes);

        this.flockTypes = this.updates
            .scan((flockTypes: FlockType[], operation: Operation) => {
                return operation(flockTypes);
            }, [])
            .do(r => console.log('r', r))
            .publishReplay(1)
            .refCount();


        this.db = this.databaseService.connect();

        this.create
            .flatMap((flockType) => this.insert(flockType))
            .map((flockType) => {
                return (flockTypes: FlockType[]) => {
                    return flockTypes.concat(flockType);
                };
            })
            .subscribe(this.updates);

        // this.populate();
    }

    getAll(): Observable<FlockType[]> {
        return this.db
            .map((db) => {
                let table = db.getSchema().table(FlockType.TABLE_NAME);
                return db
                    .select()
                    .from(table)
                    .orderBy(table['name'], lf.Order.ASC);
            })
            // .flatMap(query => this.observe(query, this.handler))
            .flatMap(query => query.exec())
            .map((rows) => {
                return (flockTypes: FlockType[]) => {
                    return flockTypes.concat(FlockType.parseRows(rows));
                };
            })
            .map( op => {
                return this.ngZone.run(() => { this.updates.next(op); });
            });

    }

    insert(flockType: FlockType): Observable<Object[]> { // TODO move to base
        return this.db
            .switchMap((db) => {
                let table = db.getSchema().table(FlockType.TABLE_NAME);
                return db
                    .insert()
                    .into(table)
                    .values([table.createRow(flockType.toRow())])
                    .exec();
            })
            .map(() => flockType);
    }

    public unobserve(): void { // TODO move to base service
        for (const [index, queryState] of this.queryStates.entries()) {
            this.database.unobserve(queryState.query, queryState.handler);
            this.queryStates.splice(index, 1);
        }
    }

    private observe(query: lf.query.Select, handler: Function, ...args): Observable<Object[]> { // TODO move to base
        return this.db
            .map(db => db.observe(query, handler))
            .map(() => this.queryStates.push({ query: query, handler: handler }))
            .map(() => query);
    }

    private populate() {
        this.create.next(new FlockType({ id: 1, breedingPeriod: 42, name: 'Brojler' }));
        this.create.next(new FlockType({ id: 2, breedingPeriod: 96, name: 'Indyk' }));

    }

}

interface Operation extends Function {
    (flockType: FlockType[]): FlockType[];
}
